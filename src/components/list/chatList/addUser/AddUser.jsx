import { useState } from "react"
import "./addUser.css"
import { db } from "../../../../lib/firebase"
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import { useUserStore } from "../../../../lib/userStore"

const AddUser = ({ onClose }) => {
  const [user, setUser] = useState(null)
  const [isAlreadyFriend, setIsAlreadyFriend] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const { currentUser } = useUserStore()

  const handleSearch = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const username = formData.get("username")

    if (!username.trim()) return
    if (username.toLowerCase() === currentUser.username.toLowerCase()) {
      alert("You cannot add yourself!")
      return
    }

    try {
      const userRef = collection(db, "users")
      const q = query(userRef, where("username", "==", username))
      const querySnapShot = await getDocs(q)

      if (!querySnapShot.empty) {
        const foundUser = querySnapShot.docs[0].data()
        setUser(foundUser)

        // ตรวจสอบว่าเป็นเพื่อนแล้วหรือยัง
        const currentUserChatsRef = doc(db, "userchats", currentUser.id)
        const currentUserChatsSnap = await getDoc(currentUserChatsRef)
        
        if (currentUserChatsSnap.exists()) {
          const currentUserChats = currentUserChatsSnap.data().chats || []
          const isAlready = currentUserChats.some(chat => chat.receiverId === foundUser.id)
          setIsAlreadyFriend(isAlready)
        }
      } else {
        alert("User not found!")
        setUser(null)
      }
    } catch (err) {
      console.log(err)
      alert("Error searching user!")
    }
  }

  const handleAdd = async () => {
    if (isAlreadyFriend) {
      alert("Already friends!")
      return
    }

    const chatRef = collection(db, "chats")
    const userChatsRef = collection(db, "userchats")

    try {
      const newChatRef = doc(chatRef)

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      })

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      })

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      })

      setIsAdded(true)
      alert("Friend added successfully!")
    } catch (err) {
      console.log(err)
      alert("Failed to add friend!")
    }
  }

  return (
    <div className="addUser">
      <div className="header">
        <h3>Add Friend</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Enter username" name="username" />
        <button type="submit">Search</button>
      </form>
      
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "/avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button 
            onClick={handleAdd} 
            disabled={isAlreadyFriend || isAdded}
            className={isAlreadyFriend || isAdded ? 'disabled' : ''}
          >
            {isAlreadyFriend ? "Already Friends" : isAdded ? "Added ✓" : "Add Friend"}
          </button>
        </div>
      )}
      
      {isAdded && (
        <div className="success-message">
          <p>✅ Friend added successfully!</p>
          <button className="back-btn" onClick={onClose}>
            Back to Chat
          </button>
        </div>
      )}
    </div>
  )
}

export default AddUser