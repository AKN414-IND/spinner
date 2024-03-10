import { useCallback } from 'react';

export function useSpinTheWheel(coupons, dispatch) {
  const spinTheWheel = useCallback(() => {
    dispatch({ type: 'SPIN_START' });

    setTimeout(() => {
      const totalProbability = coupons.reduce((acc, coupon) => acc + coupon.probability, 0);
      let random = Math.floor(Math.random() * totalProbability);
      let selectedCoupon = null;

      for (const coupon of coupons) {
        if (random < coupon.probability) {
          selectedCoupon = coupon;
          break;
        }
        random -= coupon.probability;
      }

      dispatch({ type: 'SPIN_STOP', coupon: selectedCoupon });
    }, 3000);
  }, [coupons, dispatch]);

  return spinTheWheel;
}
