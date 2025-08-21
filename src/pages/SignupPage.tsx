import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      if (data.user) {
        // Insert a new profile for the user with a default role
        const { error: profileError } = await supabase.from('profiles').insert({
          user_id: data.user.id,
          email: data.user.email, // Opcional, si quieres guardar el email también en profiles
          role: 'client', // Rol por defecto
        });

        if (profileError) {
          console.error("Error al crear el perfil del usuario:", profileError);
          toast.error("Error al crear el perfil del usuario.");
          // Considerar revertir el registro de usuario si la creación del perfil falla
        }
      }
      toast.success('¡Registro exitoso! Por favor, revisa tu correo para confirmar tu cuenta.');
      navigate('/login'); // Redirigir a la página de login
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Registrarse</CardTitle>
          <CardDescription>Crea una cuenta para acceder a todas las funciones</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Cargando...' : 'Registrarse'}
            </Button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
