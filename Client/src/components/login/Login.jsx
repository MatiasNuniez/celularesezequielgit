import React, { useEffect, useState } from 'react'
import axios from 'axios'
import imagen from '../../assets/descarga.jpg'
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        if ((user !== '') && (password !== '')) {
            try {
                const res = await axios({
                    method: 'post',
                    withCredentials:true,
                    url: 'linkpeticion',
                    data: {
                        user: user,
                        password: password
                    },
                })
                const data = await res.data
                console.log(data);
                if (data.token !== undefined) {
                    localStorage.setItem('token', data.token)
                    navigate('/')
                } else {
                    alert('Usuario o contrasena invalidos')
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            alert('Usuario o contrasena vacio')
        }
    }

    useEffect(() => {
        setToken(localStorage.getItem('token'))
    }, [])

    return (
        <div className='container'>
            {token !== null ?
                navigate('/')
                : <div className='Login'>
                    <img src={imagen} id='img-login' alt='img-login' />
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Usuario</label>
                            <input type="text" className="form-control" id="user" aria-describedby="emailHelp" onChange={e => setUser(e.target.value)} value={user} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input type="password" className="form-control" id="password" onChange={e => setPassword(e.target.value)} value={password} />
                        </div>
                        <button type="submit" className="btn btn-primary">Ingresar</button>
                    </form>
                </div>
            }
        </div>
    )

}