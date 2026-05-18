'use client'

import { useEffect, useRef, useCallback } from 'react'
 import io, { Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'

export function useSocket(room?: string) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    const socket: Socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
      if (room) {
        socket.emit('join-room', room)
      }
    })

    socket.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error.message)
    })

    return () => {
      socket.disconnect()
    }
  }, [room])

  const emit = useCallback((event: string, data: any) => {
    socketRef.current?.emit(event, data)
  }, [])

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    socketRef.current?.on(event, callback)
    return () => {
      socketRef.current?.off(event, callback)
    }
  }, [])

  return { socket: socketRef.current, emit, on }
}
































// 'use client'

// import { useEffect, useRef, useCallback } from 'react'

// const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'

// export function useSocket(room?: string) {
//   const socketRef = useRef<any>(null)

//   useEffect(() => {
//     // Only run on client side
//     if (typeof window === 'undefined') return

//     import('socket.io-client').then(({ io }) => {
//       const token = localStorage.getItem('token')
      
//       const socket = io(SOCKET_URL, {
//         auth: { token },
//         transports: ['websocket', 'polling'],
//       })

//       socketRef.current = socket

//       socket.on('connect', () => {
//         console.log('Socket connected:', socket.id)
//         if (room) {
//           socket.emit('join-room', room)
//         }
//       })

//       socket.on('connect_error', (error: Error) => {
//         console.error('Socket connection error:', error.message)
//       })
//     })

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect()
//       }
//     }
//   }, [room])

//   const emit = useCallback((event: string, data: any) => {
//     socketRef.current?.emit(event, data)
//   }, [])

//   const on = useCallback((event: string, callback: (...args: any[]) => void) => {
//     socketRef.current?.on(event, callback)
//     return () => {
//       socketRef.current?.off(event, callback)
//     }
//   }, [])

//   return { socket: socketRef.current, emit, on }
// }



























































// 'use client'

// import { useEffect, useRef, useCallback } from 'react'
// import { io, Socket } from 'socket.io-client'

// const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'

// export function useSocket(room?: string) {
//   const socketRef = useRef<Socket | null>(null)

//   useEffect(() => {
//     const token = localStorage.getItem('token')
    
//     const socket = io(SOCKET_URL, {
//       auth: { token },
//       transports: ['websocket', 'polling'],
//     })

//     socketRef.current = socket

//     socket.on('connect', () => {
//       console.log('Socket connected:', socket.id)
//       if (room) {
//         socket.emit('join-room', room)
//       }
//     })

//     socket.on('connect_error', (error) => {
//       console.error('Socket connection error:', error.message)
//     })

//     return () => {
//       socket.disconnect()
//     }
//   }, [room])

//   const emit = useCallback((event: string, data: any) => {
//     socketRef.current?.emit(event, data)
//   }, [])

//   const on = useCallback((event: string, callback: (...args: any[]) => void) => {
//     socketRef.current?.on(event, callback)
//     return () => {
//       socketRef.current?.off(event, callback)
//     }
//   }, [])

//   return { socket: socketRef.current, emit, on }
// }











// 'use client'

// import { useEffect, useRef, useCallback } from 'react'
// import { io, Socket } from 'socket.io-client'

// const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'

// export function useSocket(room?: string) {
//   const socketRef = useRef<Socket | null>(null)

//   useEffect(() => {
//     const token = localStorage.getItem('token')
    
//     socketRef.current = io(SOCKET_URL, {
//       auth: { token },
//       transports: ['websocket', 'polling'],
//     })

//     socketRef.current.on('connect', () => {
//       console.log('Socket connected:', socketRef.current?.id)
//       if (room) {
//         socketRef.current?.emit('join-room', room)
//       }
//     })

//     socketRef.current.on('connect_error', (error) => {
//       console.error('Socket connection error:', error.message)
//     })

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect()
//       }
//     }
//   }, [room])

//   const emit = useCallback((event: string, data: any) => {
//     socketRef.current?.emit(event, data)
//   }, [])

//   const on = useCallback((event: string, callback: (...args: any[]) => void) => {
//     socketRef.current?.on(event, callback)
//     return () => {
//       socketRef.current?.off(event, callback)
//     }
//   }, [])

//   return { socket: socketRef.current, emit, on }
// }


















































// 'use client'

// import { useEffect, useRef } from 'react'
// import { io, Socket } from 'socket.io-client'

// const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'

// export function useSocket(room?: string) {
//   const socketRef = useRef<Socket | null>(null)

//   useEffect(() => {
//     socketRef.current = io(SOCKET_URL)

//     if (room) {
//       socketRef.current.emit('join-room', room)
//     }

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect()
//       }
//     }
//   }, [room])

//   return socketRef.current
// }