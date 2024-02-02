// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useHttp} from '../../hooks/http.hook';
import { filtersFetched, filtersFetching, filtersFetchingError, activeFilterChanged } from '../../actions';

import Spinner from '../spinner/Spinner';

const HeroesFilters = () => {

    const {filters, filtersLoadingStatus} = useSelector(state => state);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(filtersFetching());
        request("http://localhost:3001/filters")
            .then(data => dispatch(filtersFetched(data)))
            .catch(() => dispatch(filtersFetchingError()))

        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Помилка завантаження</h5>
    } 

    const renderButtons = (arr) => {
        if (arr.length === 0){
            return;
        } else {
            return arr.map(({name, label, className}) => {
                return  <button className={className}
                                key={name}
                                onClick={() =>
                                    {
                                        dispatch(activeFilterChanged(name))
                                    }}
                                > {label}</button>
                    })
        }
    }

    const buttons = renderButtons(filters);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Відфільтруйте героїв за елементами</p>
                <div className="btn-group">
                    {buttons}

                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;