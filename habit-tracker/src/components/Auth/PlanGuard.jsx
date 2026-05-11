import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePlanContext } from '../../context/PlanContext';

const planWeights = {
  free: 0,
  pro: 1,
  elite: 2
};

const PlanGuard = ({ requiredPlan = 'pro', children }) => {
  const { currentPlan, isPro, isElite } = usePlanContext();

  const currentWeight = planWeights[currentPlan] || 0;
  const requiredWeight = planWeights[requiredPlan] || 1;

  if (currentWeight < requiredWeight) {
    return <Navigate to="/upgrade" replace />;
  }

  return children;
};

export default PlanGuard;