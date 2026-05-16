import { FC, memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { getIngredientsThunk } from '../../services/ingredients/ingredients-slice';
import { AppDispatch, useDispatch, useSelector } from '../../services/store';
import {
  addIngredientToOrder,
  selectCurrentOrderIngredients
} from '../../services/constructor/constructor-slice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = ({
  ingredient,
  count
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const order = useSelector(selectCurrentOrderIngredients);

  const handleAdd = () => {
    dispatch(addIngredientToOrder(ingredient));
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
};
