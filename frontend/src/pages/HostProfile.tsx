import { useParams, Link } from "react-router-dom";
import { fetchUserById, UserResponse } from "../lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { startGetPostsByUser } from "../store/thunks/postThunk";
import { motion } from "framer-motion";
import { database, ref, push, set, get, update } from '../lib/firebase';
import { addConversation, openChat } from '../store/slices/chatSlice';
import { FaMessage } from 'react-icons/fa6';

const HostProfile = () => {
    const {user_id} = useParams();
    const [host, setHost] = useState<UserResponse>();
    const dispatch = useDispatch<AppDispatch>();
    const userPosts = useSelector((state: any) => state.post.userPosts ?? []);
    const currentUser = useSelector((state: RootState) => state.user);
    const authStatus = useSelector((state: RootState) => state.auth.status);
    const isAuthenticated = authStatus === 'authenticated';

    useEffect(() => {
        const fetchHost = async () => {
          if (user_id) {
            try {
              const hostInfo = await fetchUserById(user_id)
              setHost(hostInfo)
              console.log(hostInfo)
            } catch (error) {
              console.log('No se pudo obtener la información del anfitrión')
              toast.error('No se pudo obtener la información del anfitrión')
            } 
          }
        }
        fetchHost()
    }, [user_id])

    const handleStartChat = async () => {
      if (!currentUser.id || !host) return;

      try {
        // Check if conversation already exists
        const userChatsRef = ref(database, `userChats/${currentUser.id}`);
        const snapshot = await get(userChatsRef);
        const existingChats = snapshot.val() || {};
        
        const existingChat = Object.entries(existingChats).find(([_, chat]: [string, any]) => 
          chat.participantId === host.id
        );

        if (existingChat) {
          // If chat exists, open it
          dispatch(openChat({ conversationId: existingChat[0] }));
        } else {
          // Create new chat
          const chatId = push(ref(database, 'chats')).key;
          
          // Set up chat for current user
          const currentUserChatData = {
            participantId: host.id,
            participantName: host.name,
            participantPhoto: host.profilepic,
            lastMessage: '',
            unreadCount: 0
          };
          
          // Set up chat for host
          const hostChatData = {
            participantId: currentUser.id,
            participantName: currentUser.name,
            participantPhoto: currentUser.profilepic,
            lastMessage: '',
            unreadCount: 0
          };

          // Update both users' chat lists
          const updates: { [key: string]: any } = {};
          updates[`userChats/${currentUser.id}/${chatId}`] = currentUserChatData;
          updates[`userChats/${host.id}/${chatId}`] = hostChatData;
          
          await update(ref(database), updates);

          // Add to local state and open chat
          dispatch(addConversation({
            id: chatId,
            ...currentUserChatData
          }));
          dispatch(openChat({ conversationId: chatId }));
        }
      } catch (error) {
        console.error('Error starting chat:', error);
        toast.error('No se pudo iniciar el chat');
      }
    };

    useEffect(() => {
        if (user_id) {
            dispatch(startGetPostsByUser(user_id))
        }
    }, [dispatch, user_id])

    const numberOfUserPosts = userPosts ? userPosts.length : 0;

    if (!host) {
      return <div>Cargando...</div>;
    }

    return (
        <div className="p-5 flex flex-col lg:flex-row gap-10 mb-10">
          {/* Tarjeta izquierda */}
          <div className="mx-15 rounded-3xl border border-gray-200 shadow-md p-6 w-full lg:w-70 flex flex-col items-center gap-3">
            <div className="relative">
              <img src={host?.profilepic} className="w-32 h-32 rounded-full object-cover"/>
            </div>
            <h2 className="text-2xl font-bold">{host?.name ?? ''}</h2>
            <p className="text-gray-500">Anfitrión</p>
            <div className="w-full border-t border-gray-200" />
            <div className="w-full grid grid-cols-2 text-center text-sm text-gray-600">
              <div>
                <div className="font-bold text-lg"></div>
                <div>Publicaciones</div>
                <div className="font-semibold text-xl">{numberOfUserPosts}</div>
              </div>
              <div>
                <div className="font-bold text-lg"></div>
                <div>Reservaciones</div>
              </div>
            </div>
            {isAuthenticated && currentUser.id !== host.id && (
              <button
                onClick={handleStartChat}
                className="mt-4 flex items-center gap-2 bg-primary-400 text-white px-4 py-2 rounded-full hover:bg-primary-500 transition-colors"
              >
                <FaMessage className="w-4 h-4" />
                Iniciar chat
              </button>
            )}
          </div>

          {/* Detalles a la derecha */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">Publicaciones de {host?.name ?? ''}</h2>
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-5 shadow-md rounded-xl"
            >
              {userPosts.map((post: any) => (
                <motion.div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-md p-3 max-w-xs flex flex-col gap-4 hover:bg-gray-100 transition duration-200"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link to={`/post/${post.id}`} className="flex flex-col gap-2 w-full">
                    <div className="overflow-hidden rounded-xl flex-shrink-0 w-full h-35 mx-auto">
                      <img src={post.images?.[0]} alt={post.title} className="w-full h-full object-cover rounded-xl" loading="lazy"/>
                    </div>
                    <h2 className="font-semibold text-lg">{post.title}</h2>
                    <p className="text-gray-600 font-semibold mb-1">
                      {post.night_cost?.toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'COP',
                      })} noche
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
            {!userPosts.length && (
              <p className="text-sm text-gray-500">Este anfitrión aún no tiene publicaciones.</p>
            )}
          </div>
        </div>
      )
};

export default HostProfile;
