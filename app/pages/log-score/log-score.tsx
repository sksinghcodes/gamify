import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  API_ENDPOINTS,
  CATEGORY,
  getFormValues,
  INITIAL_TASK_RECORD_FORM,
  INITIAL_WEIGHT_TRAINIG_SETS,
  ROUTES,
} from '~/constants';
import type {
  CategoryEnum,
  TaskRecordFormState,
  TaskRecordReqBody,
  TaskWithRecord,
  WeightTrainingSet,
  WeightTrainingSetForm,
} from '~/types/task-types';
import styles from './log-score.module.css';
import { extractValues, validate } from '~/utils/validation';
import type { CustomChangeEvent } from '../../components/form-elements/option-group';
import InputText from '../../components/form-elements/input-text';
import { classes } from '~/utils/string';
import Label from '../../components/form-elements/label';
import Slider from '../../components/form-elements/slider';
import Fab, { FAB_POSITION, FAB_TYPE } from '~/fab/fab';
import { v7 as uuid } from 'uuid';
import ErrorText from '../../components/error-text/error-text';
import {
  isNotNull,
  scoreLoggerRules,
  validatCardio,
  validateCalisthenics,
  validateReps,
  validateWeight,
  weightTrainingValidations,
} from '~/validation/score-logger-rules';
import api from '~/api';
import { Context } from '~/context-provider';
import type { AxiosResponse } from 'axios';
import { useNavigate, useSearchParams } from 'react-router';

export const meta = () => {
  return [{ title: ROUTES.LOG_SCORE.title }];
};

const LogScore: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('taskId');
  const taskDate = searchParams.get('taskDate');

  const { loading, setLoading, cacheByDate, setCacheByDate, setCacheById } =
    useContext(Context);
  const getInitialWeightTrainingSets = () => {
    return {
      ...INITIAL_WEIGHT_TRAINIG_SETS,
      id: getFormValues(uuid()),
    } as WeightTrainingSetForm;
  };

  const [taskRecord, setTaskRecord] = useState<TaskRecordFormState>(
    INITIAL_TASK_RECORD_FORM
  );

  const [task, setTask] = useState<TaskWithRecord | null>(null);

  const [weightTrainingSetsArr, setWeightTrainingSetsArr] = useState<
    WeightTrainingSetForm[]
  >([]);

  const ref = useRef(null);

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  const getCategory = () => [task?.category];

  const getCategoryAndSeconds = (state: TaskRecordFormState) => [
    task?.category,
    state.cardioSeconds.value,
  ];

  const getCategoryAndMinutes = (state: TaskRecordFormState) => [
    task?.category,
    state.cardioMinutes.value,
  ];

  const handleChange = (e: CustomChangeEvent) => {
    const { name, value } = e.target;

    let finalValue = value;

    if (name !== 'weightTrainingSets') {
      finalValue = finalValue === '' ? null : Number(finalValue);
    }

    if (finalValue !== null) {
      if (
        (name === 'cardioSeconds' && finalValue > 59) ||
        (name === 'cardioMinutes' && finalValue > 999) ||
        (name === 'calisthenicsReps' && finalValue > 9999)
      ) {
        return;
      }
    }

    validate({
      rules: scoreLoggerRules,
      state: taskRecord,
      setState: setTaskRecord,
      newInput: [name as keyof TaskRecordFormState, finalValue],
      onlyValidateTouched: true,
      customValidators: {
        isNotNull,
        validateCalisthenics,
        validateCardioMinutes: (
          minutes: number | null,
          category: CategoryEnum,
          seconds: number | null
        ) => validatCardio(minutes, category, seconds),
        validateCardioSeconds: (
          seconds: number | null,
          category: CategoryEnum,
          minutes: number | null
        ) => validatCardio(minutes, category, seconds),
      },
      argumentGetters: {
        getCategory,
        getCategoryAndSeconds,
        getCategoryAndMinutes,
      },
    });

    if (name === 'cardioMinutes') {
      setTaskRecord((pre) => ({
        ...pre,
        cardioSeconds: {
          ...pre.cardioSeconds,
          error: '',
        },
      }));
    } else if (name === 'cardioSeconds') {
      setTaskRecord((pre) => ({
        ...pre,
        cardioMinutes: {
          ...pre.cardioMinutes,
          error: '',
        },
      }));
    }
  };

  const handleSubmit = async () => {
    let isAllValid = true;

    const { isValid: isMainFormValid } = validate({
      rules: scoreLoggerRules,
      state: taskRecord,
      setState: setTaskRecord,
      onlyValidateTouched: false,
      customValidators: {
        isNotNull,
        validateCalisthenics,
        validateCardioMinutes: (
          minutes: number | null,
          category: CategoryEnum,
          seconds: number | null
        ) => validatCardio(minutes, category, seconds),
        validateCardioSeconds: (
          seconds: number | null,
          category: CategoryEnum,
          minutes: number | null
        ) => validatCardio(minutes, category, seconds),
      },
      argumentGetters: {
        getCategory,
        getCategoryAndSeconds,
        getCategoryAndMinutes,
      },
    });

    const copy = weightTrainingSetsArr.map((item) => ({
      ...item,
    }));

    copy.forEach((wts, i) => {
      const { isValid } = validate({
        rules: weightTrainingValidations,
        state: wts,
        setState: (funOrObj) => {
          if (typeof funOrObj === 'function') {
            copy[i] = funOrObj(copy[i]);
          } else {
            copy[i] = funOrObj;
          }
        },
        onlyValidateTouched: false,
        customValidators: {
          validateReps,
          validateWeight,
        },
        argumentGetters: {
          getCategory,
        },
      });

      if (!isValid) {
        isAllValid = false;
      }
    });
    setWeightTrainingSetsArr(copy);

    if (!isMainFormValid) {
      isAllValid = false;
    }

    if (!isAllValid) {
      return;
    }

    try {
      const weightTrainingData: WeightTrainingSet[] | null =
        task?.category === CATEGORY.WEIGHT_TRAINING
          ? weightTrainingSetsArr.map(extractValues).map((wts) => ({
              weightInGrams: Number(wts.weight) * 1000,
              reps: Number(wts.reps),
            }))
          : null;

      const taskRecordData = extractValues(taskRecord);
      if (task?.category === CATEGORY.CARDIO) {
        taskRecordData.cardioSeconds =
          Number(taskRecordData.cardioSeconds) +
          Number(taskRecordData.cardioMinutes) * 60;
      }

      const taskRecordReqBody: TaskRecordReqBody = {
        score: Number(taskRecordData.score),
        calisthenicsReps: taskRecordData.calisthenicsReps,
        cardioSeconds: taskRecordData.cardioSeconds,
        weightTrainingSets: weightTrainingData,
      };

      setLoading(true);

      let response: AxiosResponse<any, any> | null = null;

      if (task?.taskRecord?._id) {
        response = await api.patch(
          API_ENDPOINTS.UPDATE_TASK_RECORD,
          taskRecordReqBody,
          {
            params: {
              recordId: task?.taskRecord?._id,
            },
          }
        );
      } else {
        response = await api.post(
          API_ENDPOINTS.CREATE_TASK_RECORD,
          taskRecordReqBody,
          {
            params: {
              taskId: task?._id,
              taskDate,
            },
          }
        );
      }

      if (response !== null && response.data.success && taskDate !== null) {
        const taskRecord = response.data.taskRecord;
        setCacheByDate((pre) => {
          if (pre === null) {
            return pre;
          }
          return {
            ...pre,
            [taskDate]: pre[taskDate].map((t) => {
              if (t._id === task?._id) {
                return {
                  ...t,
                  taskRecord,
                  allowEdit: false,
                };
              } else {
                return t;
              }
            }),
          };
        });
        setCacheById((pre) => {
          if (pre === null) {
            return pre;
          }
          const task = pre[taskRecord.taskId];
          if (!task) {
            return pre;
          }
          return {
            ...pre,
            [taskRecord.taskId]: { ...task, allowEdit: false },
          };
        });
        navigate(ROUTES.TASKS_TO_DO.path);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!taskId || !taskDate) {
      return;
    }
    const controller = new AbortController();
    let task: TaskWithRecord | null = null;

    (async () => {
      if (cacheByDate && cacheByDate[taskDate]) {
        task = cacheByDate[taskDate].find((t) => t._id === taskId) || null;
        setTask(task);
      } else {
        setLoading(true);
        try {
          const response = await api.get(API_ENDPOINTS.GET_ONE_TASK, {
            signal: controller.signal,
            params: {
              recordDate: taskDate,
              taskId,
            },
          });
          if (response.data?.success) {
            task = response.data?.task || null;
            setTask(task);

            if (task) {
              const taskData = task;
              setCacheById((pre) => {
                return {
                  ...(pre || {}),
                  [taskData._id]: taskData,
                };
              });
            }
          }
        } catch (error) {
          console.error('Error saving data', error);
        } finally {
          setLoading(false);
        }
      }

      if (!task) {
        return;
      }

      const {
        score = null,
        calisthenicsReps = null,
        cardioSeconds = null,
        weightTrainingSets = null,
      } = task.taskRecord || {};

      setTaskRecord((pre) => {
        let minutes: number | null = null;
        let seconds: number | null = null;

        if (typeof cardioSeconds === 'number' && !isNaN(cardioSeconds)) {
          minutes = Math.floor(cardioSeconds / 60);
          seconds = cardioSeconds % 60;
        }

        return {
          ...pre,
          score: getFormValues(score),
          calisthenicsReps: getFormValues(calisthenicsReps),
          cardioMinutes: getFormValues(minutes),
          cardioSeconds: getFormValues(seconds),
        };
      });

      const wts: WeightTrainingSetForm[] = [];

      if (weightTrainingSets !== null && weightTrainingSets.length) {
        weightTrainingSets.forEach((set) => {
          wts.push({
            id: getFormValues(uuid()),
            weight: getFormValues(set.weightInGrams / 1000),
            reps: getFormValues(set.reps),
          });
        });
      } else {
        wts.push(getInitialWeightTrainingSets());
      }

      setWeightTrainingSetsArr(wts);
    })();

    return () => {
      controller.abort();
    };
  }, [taskId, taskDate]);

  const handleSets = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const key = name as keyof WeightTrainingSetForm;
    const finalValue = value === '' ? null : Number(value);

    if (finalValue !== null) {
      if (
        (name === 'reps' && finalValue > 9999) ||
        (name === 'weight' && finalValue > 999)
      ) {
        return;
      }
    }

    const copy = weightTrainingSetsArr.map((item) => ({
      ...item,
    }));

    validate({
      rules: weightTrainingValidations,
      state: copy[index],
      setState: (funOrObj) => {
        if (typeof funOrObj === 'function') {
          copy[index] = funOrObj(copy[index]);
        } else {
          copy[index] = funOrObj;
        }
      },
      onlyValidateTouched: true,
      newInput: [key, finalValue],
      customValidators: {
        validateReps,
        validateWeight,
      },
      argumentGetters: {
        getCategory,
      },
    });

    setWeightTrainingSetsArr(copy);
  };

  const managaSets = (action: 'ADD' | 'REMOVE', index?: number) => {
    const copy = [...weightTrainingSetsArr];
    if (action === 'ADD') {
      copy.push(getInitialWeightTrainingSets());
    } else if (action === 'REMOVE' && typeof index === 'number') {
      copy.splice(index, 1);
    }
    setWeightTrainingSetsArr(copy);
  };

  const getErrorRow = (error: string) => {
    return error ? (
      <tr>
        <td colSpan={2} className="text-center">
          <ErrorText>{error}</ErrorText>
        </td>
      </tr>
    ) : null;
  };

  return (
    <div className={styles.wrap}>
      <div>
        {!!task && (
          <>
            <div className={styles.headingWrap}>
              <h1 className={styles.name}>{task.name}</h1>
              {task.description && (
                <p className={styles.description}>{task.description}</p>
              )}
            </div>
            <div className={styles.inputsWrap}>
              <>
                <table className={styles.table}>
                  <tbody>
                    {task.category === CATEGORY.CALISTHENICS ? (
                      <>
                        <tr>
                          <td>
                            <Label
                              htmlFor="calisthenicsReps"
                              className={styles.label}
                            >
                              Reps
                            </Label>
                          </td>
                          <td>
                            <InputText
                              type="number"
                              preventNonNumeric={true}
                              value={taskRecord.calisthenicsReps.value ?? ''}
                              onChange={handleChange}
                              placeholder="eg: 12"
                              id="calisthenicsReps"
                              name="calisthenicsReps"
                              className={styles.numInput}
                            />
                          </td>
                        </tr>
                        {getErrorRow(taskRecord.calisthenicsReps.error)}
                      </>
                    ) : task.category === CATEGORY.CARDIO ? (
                      <>
                        <tr>
                          <td>
                            <Label
                              htmlFor="cardioMinutes"
                              className={styles.label}
                            >
                              Minutes
                            </Label>
                          </td>
                          <td>
                            <InputText
                              type="number"
                              preventNonNumeric={true}
                              value={taskRecord.cardioMinutes.value ?? ''}
                              onChange={handleChange}
                              placeholder="eg: 2"
                              name="cardioMinutes"
                              id="cardioMinutes"
                              className={styles.numInput}
                            />
                          </td>
                        </tr>

                        <tr>
                          <td>
                            <Label
                              htmlFor="cardioSeconds"
                              className={styles.label}
                            >
                              Seconds
                            </Label>
                          </td>
                          <td>
                            <InputText
                              type="number"
                              preventNonNumeric={true}
                              value={taskRecord.cardioSeconds.value ?? ''}
                              onChange={handleChange}
                              placeholder="eg: 30"
                              name="cardioSeconds"
                              id="cardioSeconds"
                              className={styles.numInput}
                            />
                          </td>
                        </tr>
                        {getErrorRow(
                          taskRecord.cardioMinutes.error ||
                            taskRecord.cardioSeconds.error
                        )}
                      </>
                    ) : task.category === CATEGORY.WEIGHT_TRAINING ? (
                      <>
                        {weightTrainingSetsArr.map((wts, i) => (
                          <React.Fragment key={wts.id.value}>
                            <tr>
                              <td colSpan={2}>
                                <div className={styles.setTitle}>
                                  Set {i + 1}
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Label
                                  htmlFor={`reps${i}`}
                                  className={styles.label}
                                >
                                  Reps
                                </Label>
                              </td>
                              <td>
                                <div className={styles.inputButtonWrap}>
                                  <InputText
                                    type="number"
                                    preventNonNumeric={true}
                                    value={wts.reps.value ?? ''}
                                    onChange={(e) => handleSets(e, i)}
                                    name="reps"
                                    id={`reps${i}`}
                                    placeholder="eg: 13"
                                    className={styles.numInput}
                                  />
                                  <div className={styles.width40}></div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <Label
                                  htmlFor={`weight${i}`}
                                  className={styles.label}
                                >
                                  Weight (kg)
                                </Label>
                              </td>
                              <td>
                                <div className={styles.inputButtonWrap}>
                                  <InputText
                                    type="number"
                                    preventNonNumeric={true}
                                    value={wts.weight.value ?? ''}
                                    onChange={(e) => handleSets(e, i)}
                                    name="weight"
                                    id={`weight${i}`}
                                    placeholder="eg: 15"
                                    className={styles.numInput}
                                    maxDecimals={3}
                                  />
                                  {i === 0 ? (
                                    <div className={styles.width40}></div>
                                  ) : (
                                    <button
                                      className={classes(
                                        styles.manageButton,
                                        'material-symbols-outlined'
                                      )}
                                      onClick={() => managaSets('REMOVE', i)}
                                    >
                                      remove
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                            {getErrorRow(wts.reps.error || wts.weight.error)}
                          </React.Fragment>
                        ))}
                        <tr>
                          <td></td>
                          <td>
                            <button
                              className={styles.addButton}
                              onClick={() => managaSets('ADD')}
                            >
                              Add Set
                            </button>
                          </td>
                        </tr>
                      </>
                    ) : null}
                  </tbody>
                </table>
              </>
            </div>

            <div className={styles.sliderWrap}>
              <Slider
                label="Score"
                value={taskRecord.score.value}
                onChange={handleChange}
                name="score"
                className={styles.slider}
                labelProps={{
                  className: styles.scoreLabel,
                }}
                error={taskRecord.score.error}
              />
            </div>
            <Fab
              position={FAB_POSITION.LEFT}
              fabType={FAB_TYPE.SECONDARY}
              disabled={loading}
              className={styles.infoButton}
              onClick={() =>
                navigate(`${ROUTES.TASK_PREVIEW.path}?taskId=${task?._id}`)
              }
            >
              priority_high
            </Fab>
            <Fab loading={loading} disabled={loading} onClick={handleSubmit}>
              done
            </Fab>
          </>
        )}
      </div>
    </div>
  );
};

export default LogScore;
