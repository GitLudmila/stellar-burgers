import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useMatch
} from 'react-router-dom';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Preloader } from '@ui';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { getIngredientsThunk } from '../../services/ingredients/ingredients-slice';
import { useEffect } from 'react';
import { ProtectedRoute } from '../protected-route/protected-route';
import { getUserThunk } from '../../services/user/actions';

const App = () => {
  /** TODO: взять переменные из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;

  const profileOrderNumber = useMatch('/profile/orders/:number')?.params.number;
  const feedNumber = useMatch('/feed/:number')?.params.number;

  const handleModalClose = () => navigate(-1);

  const isIngredientsLoading = useSelector(
    (state: RootState) => state.ingredients.isLoading
  );
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );
  const error = useSelector((state: RootState) => state.ingredients.error);

  useEffect(() => {
    dispatch(getIngredientsThunk());
    dispatch(getUserThunk());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path={'*'} element={<NotFound404 />} />
        <Route
          path={'/'}
          element={
            isIngredientsLoading ? (
              <Preloader />
            ) : error ? (
              <div
                className={`${styles.error} text text_type_main-medium pt-4`}
              >
                {error}
              </div>
            ) : ingredients.length > 0 ? (
              <ConstructorPage />
            ) : (
              <div
                className={`${styles.title} text text_type_main-medium pt-4`}
              >
                Нет ингредиентов
              </div>
            )
          }
        />
        <Route path={'/feed'} element={<Feed />} />
        <Route
          path={'/login'}
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/register'}
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/forgot-password'}
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/reset-password'}
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/profile'}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/profile/orders'}
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path={'/feed/:number'} element={<OrderInfo />} />
        <Route
          path={'/ingredients/:id'}
          element={
            <div className={styles.detailPageWrap}>
              {' '}
              <p className={`text text_type_main-large ${styles.detailHeader}`}>
                {' '}
                Детали ингредиента{' '}
              </p>{' '}
              <IngredientDetails />{' '}
            </div>
          }
        />
        <Route
          path={'/profile/orders/:number'}
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>
      {/* ___ */}
      {background && (
        <Routes>
          <Route
            path={'/feed/:number'}
            element={
              <Modal
                title={`#${feedNumber}`}
                onClose={function (): void {
                  handleModalClose();
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path={'/ingredients/:id'}
            element={
              <Modal
                title={'Описание ингредиента'}
                onClose={function (): void {
                  handleModalClose();
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path={'/profile/orders/:number'}
            element={
              <ProtectedRoute>
                <Modal
                  title={`#${profileOrderNumber}`}
                  onClose={function (): void {
                    handleModalClose();
                  }}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
