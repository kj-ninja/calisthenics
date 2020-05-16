import React, {useState} from 'react';
import './AddTraining.scss';
import Button from "react-bootstrap/Button";
import {getRepsView} from "../../functions/getRepsView";
import {Link} from "react-router-dom";
import Header from "../Header/Header";
import firebase from "../Firebase/firebase";
import AddTrainingForm from "./AddTrainingForm/AddTrainingForm";
import addTraining from "../Ironman/Ironman";

const AddTraining = (props) => {
    const [exercisesView, setExercisesView] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState({});

    const createExerciseView = (values) => {
        setExercisesView (prevState => {
            return (
                [...prevState, {
                    name: selectedExercise.label,
                    repetitions: [values.selectedRepetitions],
                    weight: [values.selectedWeight],
                    time: [values.selectedExerciseTime],
                    id: selectedExercise.value
                }]
            )
        });
    };
    // przeszukuje exercisesView i sprawdza czy zaznaczone cwiczenie bylo juz dodawane
    // zwraca obiekt cwiczenia albo nulla gdy cwiczenie dodawane jest poraz pierwszy
    const getSelectedExercise = () => {
        let exercise = null;
        exercisesView.forEach((exerciseView) => {
            if (exerciseView.id === selectedExercise.value) {
                exercise = exerciseView;
            }
        });
        return exercise;
    };
    const addSetToSelectedExercise = (exercise, values) => {
        exercise.repetitions.push(values.selectedRepetitions);
        exercise.weight.push(values.selectedWeight);
        exercise.time.push(values.selectedExerciseTime);

        const tempArray = [...exercisesView];
        setExercisesView(tempArray);
    };
    const handleAddSet = (values) => {
        const exercise = getSelectedExercise();

        // nie ma cwiczenia, czyli trzeba stworzyc obiekt exercise a potem dodac do niego set
        if (exercise === null) {
            createExerciseView(values);
        } else {
            addSetToSelectedExercise(exercise, values);
        }
    };
    const handleDeleteExercise = (id) => {
        const tempArray = exercisesView.filter(exercise => {
            return exercise.id !== id
        });
        setExercisesView(tempArray);
    };
    const mapExercisesViewToApiRequest = (exercisesView,  values) => {
        const tempSets = [];

        exercisesView.forEach((exerciseView, i) => {
            exerciseView.repetitions.forEach((rep, j) => {
                tempSets.push({
                    exerciseId: +exercisesView[i].id,
                    repetitions: +exercisesView[i].repetitions[j],
                    weight: +exercisesView[i].weight[j],
                    time: +exercisesView[i].time[j]
                })
            });
        });

        return {
            name: values.name,
            note: values.notes,
            date: values.date + ' 00:00:00',
            duration: +values.duration,
            kcal: +values.kcal,
            sets: tempSets
        };
    };
    const handleAddTraining = (values) => {
        const training = mapExercisesViewToApiRequest(exercisesView, values);
        addTraining(training, ()=>props.history.replace('/main'));
    };
    const handleLogout = () => {
        firebase.auth().signOut().then(function () {
        }).catch(function (error) {
            console.log(error.message);
        })
    };

    return (
        <>
            <Header logoLink={"/main"}>
                <Link to="/"><Button onClick={handleLogout} variant="primary">Wyloguj się</Button></Link>
            </Header>
            <AddTrainingForm setSelectedExercise={setSelectedExercise} handleAddTraining={handleAddTraining}
                             handleAddSet={handleAddSet}/>
            <ul className="list-group">
                {exercisesView.map(element => {
                    return (
                        <li key={element.id} className="list-group-item">
                            {element.name.toUpperCase()}: {getRepsView(element)}
                            <button onClick={() => handleDeleteExercise(element.id)} type="button"
                                    className="close"
                                    aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </>
    );
};

export default AddTraining;