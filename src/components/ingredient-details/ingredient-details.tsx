import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { ingredientsSelector } from '../../services/selectors';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>(); // Получаем id ингредиента из параметров маршрута
  const ingredients = useSelector(ingredientsSelector); // Получаем список ингредиентов из стора
  /** TODO: взять переменную из стора */
  const ingredientData = ingredients.find((item) => item._id === id); // Находим ингредиент по id из параметров маршрута

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
