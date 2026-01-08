import "./detail.css"
import { auth, db } from "../../lib/firebase"
import { useChatStore } from "../../lib/chatStore"
import { useUserStore } from "../../lib/userStore"
import { arrayRemove, arrayUnion, doc, updateDoc, onSnapshot } from "firebase/firestore"
import { useState, useEffect } from "react"
import { format } from "timeago.js"

const Detail = () => {
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } =
        useChatStore()
    const { currentUser } = useUserStore()
    const [chat, setChat] = useState()
    const [recentImages, setRecentImages] = useState([])

    useEffect(() => {
        if (!chatId) return

        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            const chatData = res.data()
            setChat(chatData)
            
            // หารูปล่าสุด 4 รูป
            if (chatData?.messages) {
                const imagesWithMessages = chatData.messages
                    .filter(msg => msg.img) // เฉพาะข้อความที่มีรูป
                    .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()) // เรียงใหม่ไปเก่า
                    .slice(0, 4) // เอาแค่ 4 รูปแรก
                    .map((msg, index) => ({
                        url: msg.img,
                        name: `Recent_Photo_${index + 1}.jpg`,
                        createdAt: msg.createdAt
                    }))
                
                setRecentImages(imagesWithMessages)
            }
        })

        return () => {
            unSub()
        }
    }, [chatId])

    const handleDownload = (imageUrl, fileName) => {
        const link = document.createElement('a')
        link.href = imageUrl
        link.download = fileName
        link.click()
    }

    const handleToggleSection = (e) => {
        const arrow = e.target
        const isUp = arrow.src.includes('arrowUp')
        arrow.src = isUp ? '/arrowDown.png' : '/arrowUp.png'
        
        // Toggle section content (you can add more complex logic here)
        const option = arrow.closest('.option')
        const content = option.querySelector('.photos')
        if (content) {
            content.style.display = content.style.display === 'none' ? 'block' : 'none'
        }
    }

    const handleBlock = async () => {
        if (!user) return

        const userDocRef = doc(db, "users", currentUser.id)

        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            })
            changeBlock()
        } catch (err) {
            console.log(err)
        }
    }

    const handleLogout = async () => {
        try {
            // อัพเดท status เป็น offline ก่อน logout
            if (currentUser?.id) {
                await updateDoc(doc(db, "users", currentUser.id), {
                    isOnline: false,
                    lastSeen: new Date()
                })
            }
        } catch (err) {
            console.log('Failed to update offline status:', err)
        }
        
        auth.signOut()
        resetChat()
    }

    return (
        <div className='detail'>
            <div className="user">
                <img src={user?.avatar || "/avatar.png"} alt="" />
                <h2>{user?.username}</h2>
                <p>{user?.isOnline ? "🟢 Online now" : `Last seen ${user?.lastSeen ? format(user.lastSeen.toDate()) : 'recently'}`}</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Setting</span>
                        <img 
                            src="/arrowUp.png" 
                            alt="" 
                            onClick={handleToggleSection}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & help</span>
                        <img 
                            src="/arrowUp.png" 
                            alt="" 
                            onClick={handleToggleSection}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared photos</span>
                        <img 
                            src="/arrowDown.png" 
                            alt="" 
                            onClick={handleToggleSection}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                    <div className="photos">
                        {recentImages.length > 0 ? (
                            recentImages.map((image, index) => (
                                <div className="photoItem" key={index}>
                                    <div className="photoDetail">
                                        <img src={image.url} alt={`Recent photo ${index + 1}`} />
                                        <span>{image.name}</span>
                                    </div>
                                    <img 
                                        src="/download.png" 
                                        alt="" 
                                        className="icon"
                                        onClick={() => handleDownload(image.url, image.name)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="photoItem">
                                <div className="photoDetail">
                                    <img src="/avatar.png" alt="No photos" />
                                    <span>No shared photos yet</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img 
                            src="/arrowUp.png" 
                            alt="" 
                            onClick={handleToggleSection}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                </div>
                <button onClick={handleBlock}>
                    {isCurrentUserBlocked
                        ? "You are Blocked!"
                        : isReceiverBlocked
                        ? "User blocked"
                        : "Block User"}
                </button>
                <button className="logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Detail