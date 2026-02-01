import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const ChatHistory = () => {
  const { user } = useAppContext();
  const [chatRooms, setChatRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Perbedaan Utama: Di sini kita memfilter berdasarkan 'customerId'
    const q = query(
      collection(db, "chatRooms"),
      where("customerId", "==", user._id), 
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChatRooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto my-10 px-4 min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Riwayat Chat Saya</h1>
      
      <div className="grid gap-4">
        {chatRooms.length > 0 ? chatRooms.map((room) => (
          <div 
            key={room.id}
            onClick={() => navigate(`/chat/${room.roomId}`)}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all border-l-4 border-l-blue-500"
          >
            {/* Foto Mobil */}
            <img src={room.carImage} className="w-16 h-16 rounded-xl object-cover bg-gray-100" alt={room.carName} />
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{room.carName}</h3>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Owner ID: {room.ownerId.substring(0,8)}...</p>
                </div>
                <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-md text-gray-500">
                  {room.updatedAt?.toDate().toLocaleDateString()}
                </span>
              </div>
              
              {/* Pesan Terakhir */}
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-600 truncate max-w-[200px] md:max-w-md italic">
                  "{room.lastMessage || "Belum ada pesan"}"
                </p>
                <div className="text-blue-600 text-xs font-bold flex items-center gap-1">
                  Buka Chat 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Anda belum pernah mengirim pesan ke pemilik mobil.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              Cari Mobil Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;