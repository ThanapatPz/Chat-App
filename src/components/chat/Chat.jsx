import "./chat.css"
import EmojiPicker from "emoji-picker-react"
import { useState, useRef, useEffect } from "react"
import ImageModal from "./ImageModal"
import { formatMessageWithLinks } from "../../lib/messageUtils.jsx"
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore"
import { db } from "../../lib/firebase"
import { useChatStore } from "../../lib/chatStore"
import { useUserStore } from "../../lib/userStore"
import upload from "../../lib/upload"
import { format } from "timeago.js"

const Chat = () => {
    const [open, setOpen] = useState(false)
    const [text, setText] = useState("")
    const [chat, setChat] = useState()
    const [img, setImg] = useState({
        file: null,
        url: "",
    })
    const [modalImage, setModalImage] = useState({
        src: "",
        alt: "",
        isOpen: false
    })

    const { currentUser } = useUserStore()
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, resetChat } =
        useChatStore()

    const endRef = useRef(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [])

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            const chatData = res.data()
            setChat(chatData)
            
            // อัพเดท read status สำหรับข้อความที่ยังไม่ได้อ่าน
            if (chatData?.messages) {
                const unreadMessages = chatData.messages.filter(
                    msg => msg.senderId !== currentUser?.id && !msg.isSeen
                )
                
                if (unreadMessages.length > 0) {
                    // อัพเดท messages ให้เป็น read
                    const updatedMessages = chatData.messages.map(msg => 
                        msg.senderId !== currentUser?.id ? { ...msg, isSeen: true } : msg
                    )
                    
                    updateDoc(doc(db, "chats", chatId), {
                        messages: updatedMessages
                    }).catch(err => console.log('Failed to update read status:', err))
                }
            }
        })

        return () => {
            unSub()
        }
    }, [chatId, currentUser?.id])

    const handleEmojiClick = (e) => {
        setText((prev) => prev + e.emoji)
        setOpen(false)
    }

    const handleImg = (e) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            })
        }
    }

    const openImageModal = (src, alt = "Image") => {
        setModalImage({
            src,
            alt,
            isOpen: true
        })
    }

    const closeImageModal = () => {
        setModalImage({
            src: "",
            alt: "",
            isOpen: false
        })
    }

    const handleSend = async () => {
        if (text === "" && !img.file) return

        let imgUrl = null

        try {
            if (img.file) {
                console.log('🖼️ Uploading image:', img.file.name, img.file.size, 'bytes');
                imgUrl = await upload(img.file)
                console.log('✅ Upload successful, URL:', imgUrl ? imgUrl.substring(0, 100) + '...' : 'null');
            }

            // สร้างข้อความ - ถ้ามีรูปแต่ไม่มีข้อความ ให้ใส่ข้อความว่าง
            const messageText = text || (imgUrl ? "" : "");

            console.log('💾 Saving message to Firestore...');
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text: messageText,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                }),
            })
            console.log('✅ Message saved successfully');

            const userIDs = [currentUser.id, user.id]

            userIDs.forEach(async (id) => {
                const userChatsRef = doc(db, "userchats", id)
                const userChatsSnapshot = await getDoc(userChatsRef)

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data()

                    const chatIndex = userChatsData.chats.findIndex(
                        (c) => c.chatId === chatId
                    )

                    userChatsData.chats[chatIndex].lastMessage = text || (imgUrl ? "📷 Image" : "")
                    userChatsData.chats[chatIndex].isSeen =
                        id === currentUser.id ? true : false
                    userChatsData.chats[chatIndex].updatedAt = Date.now()

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    })
                }
            })
        } catch (err) {
            console.error('❌ Error sending message:', err)
            alert('Failed to send message: ' + err.message)
        } finally {
            setImg({
                file: null,
                url: "",
            })

            setText("")
        }
    }

    return (
        <div className='chat'>
            <div className="top">
                <div className="user">
                    <img src={user?.avatar || "/avatar.png"} alt="" />
                    <div className="texts">
                        <span>{user?.username}</span>
                        <p>{user?.isOnline ? "Online" : `Last seen ${user?.lastSeen ? format(user.lastSeen.toDate()) : 'recently'}`}</p>
                    </div>
                </div>
                <div className="icon">
                    <img 
                        src="/phone.png" 
                        alt="" 
                        onClick={() => alert('Voice call feature coming soon!')}
                        style={{ cursor: 'pointer' }}
                    />
                    <img 
                        src="/video.png" 
                        alt="" 
                        onClick={() => alert('Video call feature coming soon!')}
                        style={{ cursor: 'pointer' }}
                    />
                    <img 
                        src="/info.png" 
                        alt="" 
                        onClick={() => alert('User info displayed on the right!')}
                        style={{ cursor: 'pointer' }}
                    />
                    <img 
                        src="/minus.png" 
                        alt="Close Chat" 
                        onClick={() => {
                            resetChat()
                        }}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        title="Close Chat"
                    />
                </div>
            </div>
            <div className="center">
                {chat?.messages?.map((message) => (
                    <div
                        className={
                            message.senderId === currentUser?.id ? "message own" : "message"
                        }
                        key={message?.createdAt}
                    >
                        <div className="text">
                            {message.img && (
                                <img 
                                    src={message.img} 
                                    alt="Chat image" 
                                    onClick={() => openImageModal(message.img, "Chat image")}
                                    style={{ cursor: 'pointer' }}
                                />
                            )}
                            {message.text && (
                                <p>{formatMessageWithLinks(message.text)}</p>
                            )}
                            <div className="message-footer">
                                <span>{format(message.createdAt.toDate())}</span>
                                {message.senderId === currentUser?.id && (
                                    <span className="read-status">
                                        {message.isSeen ? "✓✓" : "✓"}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                        <img src="/img.png" alt="" />
                    </label>
                    <input
                        type="file"
                        id="file"
                        style={{ display: "none" }}
                        onChange={handleImg}
                    />
                    <img 
                        src="/camera.png" 
                        alt="" 
                        onClick={() => document.getElementById('file').click()}
                        style={{ cursor: 'pointer' }}
                    />
                    <img 
                        src="/mic.png" 
                        alt="" 
                        onClick={() => alert('Voice recording feature coming soon!')}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <div className="input-container">
                    {/* Image Preview เล็กๆ บนกล่องข้อความ */}
                    {img.url && (
                        <div className="image-preview-small">
                            <img 
                                src={img.url} 
                                alt="Preview" 
                                onClick={() => openImageModal(img.url, "Image preview")}
                            />
                            <button 
                                className="remove-image-small"
                                onClick={() => setImg({ file: null, url: "" })}
                            >
                                ×
                            </button>
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder={
                            isCurrentUserBlocked || isReceiverBlocked
                                ? "You cannot send a message"
                                : img.url ? "Add a caption..." : "Type something..."
                        }
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        disabled={isCurrentUserBlocked || isReceiverBlocked}
                    />
                </div>
                <div className="emojis">
                    <img
                        src="/emoji.png"
                        alt=""
                        onClick={() => setOpen((prev) => !prev)}
                    />
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmojiClick} />
                    </div>
                </div>
                <button
                    className="sendButton"
                    onClick={handleSend}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                >
                    Send
                </button>
            </div>

            <ImageModal
                src={modalImage.src}
                alt={modalImage.alt}
                isOpen={modalImage.isOpen}
                onClose={closeImageModal}
            />
        </div>
    )
}

export default Chat