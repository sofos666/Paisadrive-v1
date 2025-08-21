import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // 'admin', 'dealership', 'client'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (!session) {
        navigate('/login', { replace: true });
        setLoading(false);
        return;
      }

      // --- Lógica para obtener el rol del usuario (marcador de posición) ---
      // Esta parte solo funcionará una vez que Supabase esté configurado
      // y tengas una tabla 'profiles' con los roles de usuario.
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;

        setUserRole(profile?.role || null);

        if (requiredRole && profile?.role !== requiredRole) {
          console.error(`Acceso denegado. Se requiere el rol: ${requiredRole}`);
          navigate('/', { replace: true }); // Redirigir a la página principal si no tiene el rol
        }
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
        console.error("Error al verificar el rol del usuario.");
        navigate('/login', { replace: true }); // En caso de error, redirigir al login
      }
      // --- Fin de la lógica de marcador de posición ---

      setLoading(false);
    };

    checkAuthAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/login', { replace: true });
      } else {
        // Si la sesión cambia, re-verificar el rol
        checkAuthAndRole();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, requiredRole]);

  if (loading) {
    return <div>Cargando...</div>; // O un spinner de carga
  }

  if (!session || (requiredRole && userRole !== requiredRole)) {
    return null; // O un mensaje de acceso denegado si no se redirige inmediatamente
  }

  return <>{children}</>;
}
