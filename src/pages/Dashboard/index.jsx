import { useCallback, useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export const Dashboard = () => {
  const [foods, setFoods] = useState([]);
  const [editingFood, setEditingFood] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleAddFood = useCallback(async (food) => {
    try {
      const response = await api.post('/foods', { ...food, available: true });

      setFoods(state => [...state, response.data]);
    } catch (err) {
      console.log(err);
    }
  }, []);


  const handleUpdateFood = useCallback(async (food) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }, [editingFood, foods]);

  const handleDeleteFood = useCallback(async (id) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }, [foods]);

  const handleEditFood = useCallback(food => {
    setEditingFood(food);
    setEditModalOpen(true);
  }, []);

  const toggleEditModal = useCallback(() => {
    setEditModalOpen(state => !state);
  }, []);

  const toggleModal = useCallback(() => {
    setModalOpen(state => !state);
  }, []);

  useEffect(() => {
    api.get('foods').then(response => setFoods(response.data));
  }, []);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
