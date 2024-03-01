import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const filterProducts = (character, buscado) => {
  if (!buscado) return character;

  return character.filter((p) => `${p.modelo}`.toLowerCase().includes(buscado.toLowerCase()));
};


export const Prestados = () => {

  const [buscado, setBuscado] = useState('')

  const [check, setCheck] = useState('sarmiento')

  const [title, setTitle] = useState('')

  const [buttonAddOrEdit, setButtonAddOrEdit] = useState('')

  const [nombre, setNombre] = useState('')

  const [numero, setNumero] = useState('')

  const [modelo, setModelo] = useState('')

  const [razon, setRazon] = useState('')

  const [local, setLocal] = useState('')

  const [id, setId] = useState(0)

  const [op, setOp] = useState(0)

  const [data, setData] = useState([])

  const [token, setToken] = useState(localStorage.getItem('') || '')

  const [idDelete, setIdDelete] = useState('')

  const navigate = new useNavigate()

  const realData = data.filter((p) => (`${p.local}` === check))

  const filteredProducts = filterProducts(realData, buscado);

  const getData = async () => {
    try {
      const res = await axios.get('linkpeticionhttp', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      const dataRes = await res.data
      setData(dataRes)
    } catch (error) {
      console.error(error)
      localStorage.removeItem('')
      navigate('/login')
    }
  }

  const openModal = async (op, id, nombre, numero, modelo, razon, local) => {
    try {
      setNombre('')
      setNumero('')
      setModelo('')
      setRazon('')
      setLocal('')
      if (op === 1) {
        setOp(1)
        setTitle('Agregar cliente')
        setButtonAddOrEdit('Agregar')
      } else if (op === 2) {
        setOp(2)
        setTitle('Editar cliente')
        setButtonAddOrEdit('Editar')
        setNombre(nombre)
        setModelo(modelo)
        setNumero(numero)
        setRazon(razon)
        setLocal(local)
        setId(id)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const postAndEdit = async (id, nombre, numero, modelo, razon, local) => {
    try {
      if (op === 1) {
        if ((nombre !== '') && (numero !== '') && (modelo !== '') && (razon !== '') && (local !== '') && (numero.length === 10)) {
          const newData = {
            nombre: nombre,
            numero: numero,
            modelo: modelo,
            razon: razon,
            local: local
          }
          await axios.post('linkpeticionhttp',
            newData, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }).then(res => {
            setData([...data, res.data[0]])
            alert('Elementos ingresados correctamente')
            setNombre('')
            setNumero('')
            setModelo('')
            setRazon('')
            setLocal('')
          })
            .catch(error => alert(`No se pudo ingresar el elemento por el siguiente error ${error}`))
        } else {
          alert('Complete todos los campos (Recuerde que numero lleva 10 numeros)')
        }
      } else if (op === 2) {
        const newData = {
          nombre: nombre,
          numero: numero,
          modelo: modelo,
          razon: razon,
          local: local
        }
        await axios.put(`linkpeticionhttp/${id}`, newData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }).then(res => {
            const newArray = data.map(item => {
              if (item._id === res.data._id) {
                return res.data
              }
              return item
            })
            setData(newArray)
            alert('Elementos editados correctamente')
            setNombre('')
            setNumero('')
            setModelo('')
            setLocal('')
            setRazon('')
            setId(0)
          })
          .catch(error => alert(`No se pudo ingresar el elemento por el siguiente error ${error}`))
      }
    } catch (error) {
      alert(`No se pudo realizar la operacion. Error: ${error}`)
    }
  }

  const deleteItem = async () => {
    try {
      await axios.delete(`linkpeticionhttp/${idDelete}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }).then(res => {
        const newData = data.filter(item => item._id !== res.data)
        setData(newData)
        alert('Elemento eliminado correctamente')
        setIdDelete('')
      })
        .catch(error => alert(`No se pudo eliminar el elemento. Error: ${error}`))
    } catch (error) {
      alert(`No se pudo eliminar el elemento. Error: ${error}`)
    }
  }


  useEffect(() => {
    getData()
    setToken(localStorage.getItem('') || '')
  }, [])


  return (

    <div>
      {token != '' ?
        <div className="container">
          <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">{title}</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form action="" className='form-modal'>
                    <input type="text" placeholder='Nombre y apellido' onChange={(e) => setNombre(e.target.value)} value={nombre} />
                    <input type="text" placeholder='Numero (si o si 10 numeros)' maxLength={10} minLength={10} onChange={(e) => setNumero(e.target.value)} value={numero} />
                    <input type="text" placeholder='Modelo' onChange={(e) => setModelo(e.target.value)} value={modelo} />
                    <input type="text" placeholder='Razon' onChange={(e) => setRazon(e.target.value)} value={razon} />
                    <select name="" id="local" onChange={(e) => setLocal(e.target.value)} value={local}>
                      <option value="none">Seleccione un local</option>
                      <option value='elisa'>Elisa</option>
                      <option value='sarmiento'>Sarmiento</option>
                      <option value='mitre'>Mitre</option>
                    </select>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                  <button type="button" className="btn btn-primary" onClick={() => postAndEdit(id, nombre, numero, modelo, razon, local)} >{buttonAddOrEdit}</button>
                </div>
              </div>
            </div>
          </div>


          <div className="modal fade" id="eliminarModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Eliminar</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <p>Desea eliminar?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setIdDelete('')}>Cerrar</button>
                  <button type="button" className="btn btn-primary" onClick={() => deleteItem(idDelete)} >Eliminar</button>
                </div>
              </div>
            </div>
          </div>

          <div className="top">
            <div className='Check mb-3 mt-3'>
              <select onChange={({ target: { value } }) => setCheck(value)}>
                <option value='sarmiento'>sarmiento</option>
                <option value='mitre'>mitre</option>
                <option value='elisa'>elisa</option>
              </select>
            </div>
            <div className='locales'>
              <button type="button" className='btn btn-success' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { openModal(1) }}>+</button>
            </div>
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" id="formGroupExampleInput" placeholder="Buscar..." value={buscado} onChange={(e) => setBuscado(e.target.value)} />
          </div>
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Nombre y apellido</th>
                  <th scope="col">Modelo</th>
                  <th scope="col">Numero</th>
                  <th scope="col">Razon</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Editar</th>
                  <th scope="col">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(dat => {
                  return (
                    <tr key={dat._id}>
                      <td>{dat.nombre}</td>
                      <td>{dat.modelo}</td>
                      <td>{dat.numero}</td>
                      <td>{dat.razon}</td>
                      <td>{dat.fecha}</td>
                      <td><button type="button" className='btn btn-warning' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => openModal(2, dat._id, dat.nombre, dat.numero, dat.modelo, dat.razon, dat.local)}>?</button></td>
                      <td><button className='btn btn-danger' data-bs-toggle="modal" data-bs-target="#eliminarModal" onClick={() => setIdDelete(dat._id)}>-</button></td>
                    </tr>)
                })}

              </tbody>
            </table>
          </div>
        </div>
        : (navigate('/login'),alert('Inicie sesion'))
      }
    </div>
  )
}
