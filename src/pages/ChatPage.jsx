import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { updateDoc } from "firebase/firestore";

const ChatPage = () => {
  const { roomId } = useParams();
  const { user } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [roomData, setRoomData] = useState(null);
  const scrollRef = useRef();

  // 1. Ambil Data Room (Nama Mobil, dll)
  useEffect(() => {
    const fetchRoom = async () => {
      const docRef = doc(db, "chatRooms", roomId);
      const snap = await getDoc(docRef);
      if (snap.exists()) setRoomData(snap.data());
    };
    fetchRoom();
  }, [roomId]);

  // 2. Listen Pesan secara Real-time
  useEffect(() => {
    const q = query(
      collection(db, "chatRooms", roomId, "messages"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [roomId]);

  // 3. Auto Scroll ke bawah saat ada pesan baru
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!roomId || !user) return;

    const roomRef = doc(db, "chatRooms", roomId);

    // kalau yang buka adalah OWNER
    if (user.role === "owner") {
      updateDoc(roomRef, {
        unreadByOwner: false,
      });
    }

    // kalau yang buka adalah CUSTOMER
    if (user.role === "customer") {
      updateDoc(roomRef, {
        unreadByCustomer: false,
      });
    }
  }, [roomId, user]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    try {
      await addDoc(collection(db, "chatRooms", roomId, "messages"), {
        text: input,
        senderId: user._id,
        senderName: user.name,
        createdAt: serverTimestamp(),
      });

      const roomRef = doc(db, "chatRooms", roomId);
      await updateDoc(roomRef, {
        lastMessage: input,
        updatedAt: serverTimestamp(),

        unreadByOwner: user.role === "customer",
        unreadByCustomer: user.role === "owner",
      });

      setInput("");
    } catch (error) {
      toast.error("Gagal mengirim pesan");
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col h-[80vh]">
      {/* Header Chat */}
      <div className="bg-blue-600 p-4 text-white flex items-center gap-4">
        <img
          src={roomData?.carImage}
          className="w-12 h-12 rounded-full object-cover border-2 border-white"
          alt=""
        />
        <div>
          <h2 className="font-bold">{roomData?.carName}</h2>
          <p className="text-xs opacity-80">
            {user.role === "owner"
              ? "Obrolan dengan Penyewa"
              : "Obrolan dengan Owner"}
          </p>
        </div>
      </div>

      {/* Area Pesan */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === user?._id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] p-4 rounded-2xl shadow-sm ${
                msg.senderId === user?._id
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className="text-[10px] mt-1 opacity-70 text-right">
                {msg.createdAt?.toDate()
                  ? new Date(msg.createdAt.toDate()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "..."}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Chat */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tulis pesan ke owner..."
          className="flex-1 bg-gray-100 border-none rounded-2xl px-6 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <button className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9-2-9-18-9 18 9 2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
