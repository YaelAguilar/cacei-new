// src/features/ptc-propuestas/presentation/components/StatisticsCards.tsx
import React from "react";
import { observer } from "mobx-react-lite";
import { PTCPropuestasViewModel } from "../viewModels/PTCPropuestasViewModel";
import { FiFileText, FiCheckCircle, FiXCircle, FiTrendingUp } from "react-icons/fi";

interface StatisticsCardsProps {
  viewModel: PTCPropuestasViewModel;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = observer(({ viewModel }) => {
  const stats = viewModel.statistics;

  const cards = [
    {
      title: "Total de Propuestas",
      value: stats.total.toString(),
      icon: FiFileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Propuestas registradas"
    },
    {
      title: "Propuestas Activas",
      value: stats.active.toString(),
      icon: FiCheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "En proceso actual"
    },
    {
      title: "Propuestas Inactivas",
      value: stats.inactive.toString(),
      icon: FiXCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      description: "Finalizadas o canceladas"
    },
    {
      title: "Tipos de Pasantía",
      value: Object.keys(stats.tiposPasantia).length.toString(),
      icon: FiTrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Categorías diferentes"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {card.title}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {card.value}
                    </div>
                  </dd>
                  <dd className="text-xs text-gray-500 mt-1">
                    {card.description}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default StatisticsCards;