import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';

interface RiskBadgeProps {
  prediction: string;
  classId?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  prediction,
  classId,
  showIcon = true,
  size = 'md',
}) => {
  const text = prediction.toLowerCase();
  
  let grade = 0;
  let label = 'No DR (Normal)';
  let icon = <CheckCircle2 size={size === 'sm' ? 12 : 14} />;
  let clinicalDescription = 'No diabetic retinopathy indicators. Annual routine re-screening.';

  if (typeof classId === 'number') {
    grade = classId;
  } else {
    if (text.includes('proliferative') || text.includes('pdr')) {
      grade = 4;
    } else if (text.includes('severe')) {
      grade = 3;
    } else if (text.includes('moderate')) {
      grade = 2;
    } else if (text.includes('mild')) {
      grade = 1;
    } else {
      grade = 0;
    }
  }

  switch (grade) {
    case 4:
      label = 'Proliferative DR (PDR)';
      icon = <Flame size={size === 'sm' ? 12 : 14} />;
      clinicalDescription = 'Level 4: Active Neovascularization / Vitreous Hemorrhage threat. Emergency referral within 24-48h.';
      break;
    case 3:
      label = 'Severe NPDR';
      icon = <AlertOctagon size={size === 'sm' ? 12 : 14} />;
      clinicalDescription = 'Level 3: 4-2-1 Rule satisfied (Deep hemorrhages/venous beading). Urgent referral within 1-2 weeks.';
      break;
    case 2:
      label = 'Moderate NPDR';
      icon = <AlertTriangle size={size === 'sm' ? 12 : 14} />;
      clinicalDescription = 'Level 2: Microaneurysms + Hard exudates / Dot hemorrhages. Specialist referral within 1 month.';
      break;
    case 1:
      label = 'Mild NPDR';
      icon = <AlertCircle size={size === 'sm' ? 12 : 14} />;
      clinicalDescription = 'Level 1: Microaneurysms only. 6-month clinic follow-up & glycemic counseling.';
      break;
    default:
      label = 'No DR (Normal)';
      icon = <CheckCircle2 size={size === 'sm' ? 12 : 14} />;
      clinicalDescription = 'Level 0: Clean fundus. Routine 12-month clinical screening.';
      break;
  }

  const paddingStyle =
    size === 'sm'
      ? { padding: '3px 8px', fontSize: 11 }
      : size === 'lg'
      ? { padding: '8px 18px', fontSize: 14 }
      : { padding: '5px 12px', fontSize: 12 };

  return (
    <span
      className={`clay-risk-badge grade-${grade}`}
      style={paddingStyle}
      title={clinicalDescription}
    >
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
};

export default RiskBadge;
