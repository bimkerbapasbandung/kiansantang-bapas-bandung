import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Shield, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: 'admin@bapas.go.id',
    password: 'adminbapas123'
  });

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign up user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) {
        // Jika user sudah ada, coba assign role saja
        if (signUpError.message.includes('already registered')) {
          toast.info('User sudah terdaftar, mencoba assign role admin...');
          
          // Login untuk get user ID
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

          if (loginError) {
            throw new Error('User sudah ada tapi password salah. Gunakan password yang benar atau reset password.');
          }

          // Assign admin role via RPC
          const { error: roleError } = await supabase.rpc('make_user_admin', {
            user_email: formData.email
          });

          if (roleError) {
            console.error('Role assignment error:', roleError);
            toast.warning('Mencoba assign role manual...');
            
            // Fallback: insert langsung
            const { error: insertError } = await supabase
              .from('user_roles')
              .insert({
                user_id: loginData.user.id,
                role: 'admin'
              });

            if (insertError && !insertError.message.includes('duplicate')) {
              throw insertError;
            }
          }

          setSuccess(true);
          toast.success('Admin role berhasil di-assign!');
          
          setTimeout(() => {
            navigate('/settings');
          }, 2000);
          return;
        }
        throw signUpError;
      }

      // 2. User baru berhasil dibuat
      if (authData.user) {
        toast.success('User admin berhasil dibuat!');
        
        // Tunggu sebentar untuk trigger berjalan
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 3. Assign admin role (backup jika trigger gagal)
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'admin'
          });

        if (roleError && !roleError.message.includes('duplicate')) {
          console.error('Role assignment error:', roleError);
          toast.warning('Role assignment error, tapi mungkin sudah auto-assign via trigger');
        }

        setSuccess(true);
        toast.success('Admin berhasil dibuat! Redirecting...');
        
        // Redirect ke settings setelah 2 detik
        setTimeout(() => {
          navigate('/settings');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast.error(error.message || 'Gagal membuat admin');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'admin@bapas.go.id',
        password: 'adminbapas123',
      });

      if (error) throw error;

      toast.success('Login berhasil!');
      navigate('/settings');
    } catch (error: any) {
      toast.error('Login gagal. Admin belum dibuat atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Shield className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Admin Setup</h1>
          <p className="text-muted-foreground text-sm">
            Setup admin user untuk pertama kali
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold text-green-600">
              Admin Berhasil Dibuat!
            </h3>
            <p className="text-sm text-muted-foreground">
              Redirecting ke halaman settings...
            </p>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold">Default Admin Credentials:</p>
                  <p className="mt-1">Email: admin@bapas.go.id</p>
                  <p>Password: adminbapas123</p>
                  <p className="mt-2 text-xs text-blue-600">
                    💡 Ganti password setelah login pertama!
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Admin</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Minimal 6 karakter
                </p>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Membuat Admin...' : 'Buat Admin & Login'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Atau
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleQuickLogin}
              disabled={loading}
              className="w-full"
            >
              Quick Login (Default Admin)
            </Button>

            <div className="text-center space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Sudah punya akun admin?{' '}
                <a href="/auth" className="text-primary hover:underline">
                  Login di sini
                </a>
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default AdminSetup;
