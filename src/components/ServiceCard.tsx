import { Card } from '@/components/ui/card';
import { ServiceType, SERVICE_NAMES } from '@/types/queue';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  type: ServiceType;
  icon: LucideIcon;
  onClick: () => void;
}

export const ServiceCard = ({ type, icon: Icon, onClick }: ServiceCardProps) => {
  const colorClasses = {
    penghadapan: 'bg-service-penghadapan hover:opacity-90',
    bimbingan: 'bg-service-bimbingan hover:opacity-90',
    kunjungan: 'bg-service-kunjungan hover:opacity-90',
    pengaduan: 'bg-service-pengaduan hover:opacity-90',
  };

  return (
    <Card
      onClick={onClick}
      className={`${colorClasses[type]} cursor-pointer transition-all duration-300 hover:scale-105 p-8 flex flex-col items-center justify-center gap-4 min-h-[200px] border-none shadow-lg`}
    >
      <Icon className="w-16 h-16 text-white" />
      <h3 className="text-2xl font-bold text-white text-center">
        {SERVICE_NAMES[type]}
      </h3>
    </Card>
  );
};
