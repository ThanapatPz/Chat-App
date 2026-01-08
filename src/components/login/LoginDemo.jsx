import React, { useState } from 'react'
import "./login.css"
import { toast, Toaster } from 'react-hot-toast'

// Demo version ที่ไม่ต้องใช้ Firebase
const LoginDemo = ({ onLoginSuccess }) => {
    const [avatar, setAvatar] = useState({
        file: null,
        url: ""
    })

    const [loading, setLoading] = useState(false)

    const handleAvatar = e => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target)

        const { username, email, password } = Object.fromEntries(formData)

        // VALIDATE INPUTS
        if (!username || !email || !password) {
            toast.error("Please enter all fields!")
            setLoading(false)
            return
        }
        if (!avatar.file) {
            toast.error("Please upload an avatar!")
            setLoading(false)
            return
        }

        // Simulate API call
        setTimeout(() => {
            toast.success("Account created successfully! Now try logging in.")
            setLoading(false)
        }, 2000)
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target)
        const { email, password } = Object.fromEntries(formData)

        if (!email || !password) {
            toast.error("Please enter email and password!")
            setLoading(false)
            return
        }

        // Simulate login
        setTimeout(() => {
            toast.success("Login successful! (Demo mode)")
            console.log('Demo login with:', { email, password })
            setLoading(false)
            
            // จำลองการ login สำเร็จ
            if (onLoginSuccess) {
                onLoginSuccess({
                    id: 'demo-user-123',
                    username: email.split('@')[0],
                    email: email,
                    avatar: avatar.url || '/avatar.png'
                })
            }
        }, 1500)
    }

    return (
        <div className='login'>
            <div className="item">
                <h2>Welcome back,</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" name="email" required />
                    <input type="password" placeholder="Password" name="password" required />
                    <button disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>
                </form>
            </div>
            <div className="separator"></div>
            <div className="item">
                <h2>Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./avatar.png"} alt="" />
                        Upload an image
                    </label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
                    <input type="text" placeholder="Username" name="username" required />
                    <input type="email" placeholder="Email" name="email" required />
                    <input type="password" placeholder="Password" name="password" required />
                    <button disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>
                </form>
            </div>
            <Toaster position="bottom-center" />
        </div>
    )
}

export default LoginDemo