// src/stores/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: (email, password) => {
        // Mock users database
        const mockUsers = [
          {
            id: '1',
            email: 'admin@wowotech.dev',
            password: 'Admin123!', // Plain password untuk demo
            fullName: 'Admin WowoTech',
            role: 'admin',
            avatar: null,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            email: 'user@wowotech.dev',
            password: 'User123!', // Plain password untuk demo
            fullName: 'Demo User',
            role: 'user',
            avatar: null,
            createdAt: new Date().toISOString()
          }
        ];

        // Find user
        const user = mockUsers.find(u => 
          u.email === email && u.password === password
        );
        
        if (user) {
          // Remove password from user object before storing
          const { password: _, ...userWithoutPassword } = user;
          
          set({ 
            user: userWithoutPassword, 
            isAuthenticated: true 
          });
          
          // RETURN OBJECT dengan success dan role
          return { 
            success: true, 
            user: userWithoutPassword,
            role: user.role 
          };
        }
        
        // RETURN OBJECT dengan error
        return { 
          success: false, 
          error: 'Email atau password salah' 
        };
      },
      
      register: (userData) => {
        const newUser = {
          id: Date.now().toString(),
          ...userData,
          role: 'user', // Default role
          avatar: null,
          createdAt: new Date().toISOString()
        };
        
        set({ 
          user: newUser, 
          isAuthenticated: true 
        });
        
        // RETURN OBJECT
        return { 
          success: true, 
          user: newUser,
          role: 'user' 
        };
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      // Quick login untuk development
      quickLogin: (role = 'user') => {
        const demoUsers = {
          admin: {
            id: '1',
            email: 'admin@wowotech.dev',
            fullName: 'Admin WowoTech',
            role: 'admin',
            avatar: null,
            createdAt: new Date().toISOString()
          },
          user: {
            id: '2',
            email: 'user@wowotech.dev',
            fullName: 'Demo User',
            role: 'user',
            avatar: null,
            createdAt: new Date().toISOString()
          }
        };
        
        set({ 
          user: demoUsers[role], 
          isAuthenticated: true 
        });
        
        return { 
          success: true, 
          user: demoUsers[role],
          role 
        };
      }
    }),
    {
      name: 'wowotech-auth', // Key untuk localStorage
    }
  )
);

  export default useAuthStore;