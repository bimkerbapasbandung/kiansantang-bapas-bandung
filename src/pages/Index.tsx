import { useState } from 'react';
import { ServiceCard } from '@/components/ServiceCard';
import { QueueTicket } from '@/components/QueueTicket';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ServiceType, SUB_SERVICE_NAMES, QueueItem } from '@/types/queue';
import { queueManager } from '@/lib/queueManager';
import { FileText, Users, UserCheck, MessageSquare, ArrowLeft, Monitor, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [generatedQueue, setGeneratedQueue] = useState<QueueItem | null>(null);

  const services = [
    { type: 'penghadapan' as ServiceType, icon: FileText },
    { type: 'bimbingan' as ServiceType, icon: UserCheck },
    { type: 'kunjungan' as ServiceType, icon: Users },
    { type: 'pengaduan' as ServiceType, icon: MessageSquare },
  ];

  const handleServiceSelect = (type: ServiceType) => {
    setSelectedService(type);
  };

  const handleSubServiceSelect = (subService: string) => {
    if (selectedService) {
      const queue = queueManager.createQueue(selectedService, subService);
      setGeneratedQueue(queue);
      setSelectedService(null);
    }
  };

  const handleCloseTicket = () => {
    setGeneratedQueue(null);
  };

  const handleBack = () => {
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2">
            BALAI PEMASYARAKATAN KELAS I BANDUNG
          </h1>
          <p className="text-center text-lg opacity-90">
            Sistem Antrian Layanan
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="max-w-7xl mx-auto p-6 flex gap-3 justify-end">
        <Button variant="outline" onClick={() => navigate('/display')}>
          <Monitor className="w-4 h-4 mr-2" />
          Tampilan Display
        </Button>
        <Button variant="outline" onClick={() => navigate('/operator')}>
          <Settings className="w-4 h-4 mr-2" />
          Operator
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {!selectedService ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Pilih Layanan</h2>
              <p className="text-muted-foreground">Silakan pilih jenis layanan yang Anda butuhkan</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map(({ type, icon }) => (
                <ServiceCard
                  key={type}
                  type={type}
                  icon={icon}
                  onClick={() => handleServiceSelect(type)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
              <h2 className="text-3xl font-bold">Pilih Sub Layanan</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(SUB_SERVICE_NAMES[selectedService]).map(([key, label]) => (
                <Card
                  key={key}
                  onClick={() => handleSubServiceSelect(key)}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card"
                >
                  <p className="text-xl font-semibold text-center">{label}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {generatedQueue && (
        <QueueTicket queue={generatedQueue} onClose={handleCloseTicket} />
      )}
    </div>
  );
};

export default Index;
