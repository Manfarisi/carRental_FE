import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { db } from "../../firebase";
import {
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import toast from "react-hot-toast";


const ChatRoom = () => {
  const { user } = useAppContext();
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Cari room dimana user ini adalah Owner-nya
    const q = query(
      collection(db, "chatRooms"),
      where("ownerId", "==", user._id),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChatRooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  const handleDeleteRoom = async (roomId) => {
  if (!window.confirm("Hapus percakapan ini?")) return;

  try {
    // 1. ambil semua pesan
    const messagesRef = collection(db, "chatRooms", roomId, "messages");
    const snapshot = await getDocs(messagesRef);

    // 2. hapus satu-satu
    const deletions = snapshot.docs.map((docu) =>
      deleteDoc(doc(db, "chatRooms", roomId, "messages", docu.id))
    );
    await Promise.all(deletions);

    // 3. hapus room
    await deleteDoc(doc(db, "chatRooms", roomId));

    toast.success("Chat berhasil dihapus");
  } catch (err) {
    toast.error("Gagal menghapus chat");
  }
};



  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Pesan Masuk (Sebagai Owner)</h1>
      
      <div className="grid gap-4">
        {chatRooms.length > 0 ? chatRooms.map((room) => (
          <div 
            key={room.id}
            onClick={() => navigate(`/chat/${room.roomId}`)}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all"
          >
            <img src={room.carImage} className="w-16 h-16 rounded-xl object-cover" alt="" />
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-bold text-gray-800">{room.carName}</h3>
                <span className="text-xs text-gray-400">
                  {room.updatedAt?.toDate().toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-blue-600 font-medium">Dari: {room.customerName}</p>
              <p className="text-sm text-gray-500 truncate mt-1">{room.lastMessage}</p>
            </div>
            <button
  onClick={(e) => {
    e.stopPropagation();
    handleDeleteRoom(room.id);
  }}
  className="text-red-500 text-sm hover:underline"
>
  Hapus
</button>

          </div>
        )) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
            <p className="text-gray-400">Belum ada penyewa yang menghubungi Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;