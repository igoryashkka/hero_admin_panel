// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров
import { useState } from 'react';
import { heroAdd } from '../../actions';
import { v4 as uuidv4 } from 'uuid';
import {useHttp} from '../../hooks/http.hook';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filtersFetched, filtersFetching, filtersFetchingError } from '../../actions';

import Spinner from '../spinner/Spinner';

const HeroesAddForm = () => {

    const [heroName, setHeroName] = useState('');
    const [heroDescr, setHeroDescr] = useState('');
    const [heroElement, setHeroElement] = useState('');

    const {filters, filtersLoadingStatus} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    const onSave = (e) => {
        e.preventDefault();
        if (heroName.length < 1 || heroDescr.length < 1 || heroElement.length < 1 ){
            return;
        } else{
            const newHero = {
                id: uuidv4(),
                name: heroName,
                description: heroDescr,
                element: heroElement
            }
            request(`http://localhost:3001/heroes`, 'POST', JSON.stringify(newHero))
           .then(dispatch(heroAdd(newHero)))
           .catch(err => console.log(err))
        }
    }

    useEffect(() => {
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()))

        // eslint-disable-next-line
    }, []);

    const renderOptions = (arr) => {
        if (filtersLoadingStatus === "loading") {
            return <Spinner/>;
        } else if (filtersLoadingStatus === "error") {
            return <h5 className="text-center mt-5">Помилка завантаження</h5>
        }

        if (arr.length === 0){
            return;
        } else {
            return arr.map(({name, label}) => {
                // if (name === 'all')  return;
                return <option value={name}> {label} </option>
            })
        }
    }

    const options = renderOptions(filters);

    return (
        <form className="border p-4 shadow-lg rounded"
            onSubmit = {onSave}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Ім'я нового героя</label>
                <input
                    required
                    type="text"
                    name="name"
                    className="form-control"
                    id="name"
                    placeholder="Як мене звати?"
                    value = {heroName}
                    onChange = {(e) => setHeroName(e.target.value)}
                    />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Опис</label>
                <textarea
                    required
                    name="text"
                    className="form-control"
                    id="text"
                    placeholder="Що я вмію?"
                    style={{"height": '130px'}}
                    value = {heroDescr}
                    onChange = {(e) => setHeroDescr(e.target.value)}
                    />
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Вибрати елемент героя</label>
                <select
                    required
                    className="form-select"
                    id="element"
                    name="element"
                    value = {heroElement}
                    onChange = {(e) => setHeroElement(e.target.value)}>
                        {options}

                    {/* <option >Я володію елементом...</option>
                    <option value="fire">Вогонь</option>
                    <option value="water">Вода</option>
                    <option value="wind">Вітер</option>
                    <option value="earth">Земля</option> */}

                </select>
            </div>

            <button type="submit" className="btn btn-primary">Створити</button>
        </form>
    )
}

export default HeroesAddForm;
