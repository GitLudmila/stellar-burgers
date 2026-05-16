import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { RootState, useDispatch, useSelector } from '../../services/store';
import {
  getFeedsThunk,
  getOrdersThunk,
  selectHistoryOrders
} from '../../services/orders/orders-slice';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(selectHistoryOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrdersThunk());
    dispatch(getFeedsThunk());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
