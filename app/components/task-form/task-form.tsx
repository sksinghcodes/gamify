import { useContext, useEffect, useState } from 'react';
import {
  INVALID_DATE_STRATEGY,
  MONTHS_3_LETTER,
  RECURRENCE,
  AUTO_REMOVE,
  INITIAL_TASK_STEP_1,
  INITIAL_TASK_STEP_2,
  INITIAL_TASK_STEP_3,
  getFormValues,
  MONTHS,
  SCHEDULE,
  API_ENDPOINTS,
  ROUTES,
} from '~/constants';
import type {
  InvalidDateStrategyEnum,
  InvalidDateStrategyUnion,
  MonthIndex,
  TaskFormState,
  TaskFormStep1,
  TaskFormStep2,
  TaskFormStep3,
  TaskWithRecord,
} from '~/types/task-types';
import styles from './task-form.module.css';
import TimeSelector from '~/components/time-selector/time-selector';
import { classes } from '~/utils/string';
import DateSelector from '../date-selector/date-selector';
import {
  extractMonthlyDates,
  getDateFromYearlyDate,
  getDateOptions,
  getDateString,
  getMonthIndexFromYearlyDate,
} from '~/utils/date-utils';
import InputText from '../form-elements/input-text';
import OptionGroup, {
  type CustomChangeEvent,
} from '../form-elements/option-group';
import { extractValues, validate } from '~/utils/validation';
import InfoText from '../info-text/info-text';
import Label from '../form-elements/label';
import {
  getRecurrenceType,
  taskStep2Rules,
  testRecurrenceValues,
} from '~/validation/step2-rules';
import {
  getAutoRemove,
  getScheduleType,
  taskStep3Rules,
  validateRemoveDate,
  validateTime,
} from '~/validation/step3-rules';
import {
  CATEGORY_INFO,
  CATEGORY_OPTIONS,
  DATE_OPTIONS,
  INVALID_DATE_STRATEFY_OPTIONS,
  INVALID_DATE_STRATEGY_INFO,
  RECURRENCE_OPTIONS,
  SCHEDULE_OPTIONS,
  WEEK_OPTIONS,
} from '~/constants/options';
import { taskStep1Rules } from '~/validation/step1-rules';
import MonthSelectorModal from '../month-selector-modal/month-selector-modal';
import Fab, { FAB_POSITION, FAB_TYPE } from '~/fab/fab';
import Modal from '../modal/modal';
import StrategyInfo from '../stratefy-info/stratefy-info';
import api from '~/api';
import { Context } from '~/context-provider';
import { useNavigate, useSearchParams } from 'react-router';
import Spinner from '../spinner/spinner';
import type { AxiosResponse } from 'axios';

const TaskForm: React.FC<{ isEditMode: boolean }> = ({ isEditMode }) => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(0);
  const [showInvalidDateOption, setShowInvalidDateOption] = useState(false);
  const [showStrategyGuide, setShowStrategyGuide] = useState(false);
  const [blockEditing, setBlockEditing] = useState(false);
  const {
    loading,
    setLoading,
    setCacheByDate,
    cacheById,
    setCacheById,
    setAllTasks,
  } = useContext(Context);
  const [taskStep1, setTaskStep1] =
    useState<TaskFormStep1>(INITIAL_TASK_STEP_1);
  const [taskStep2, setTaskStep2] =
    useState<TaskFormStep2>(INITIAL_TASK_STEP_2);
  const [taskStep3, setTaskStep3] =
    useState<TaskFormStep3>(INITIAL_TASK_STEP_3);
  const [openSelector, setOpenSelector] = useState(false);
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [step, setStep] = useState(1);
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('taskId');

  useEffect(() => {
    if (!isEditMode || !taskId) {
      return;
    }

    const setTaskFormData = (task: TaskWithRecord) => {
      setBlockEditing(!task.allowEdit);

      setTaskStep1({
        name: getFormValues(task.name),
        description: getFormValues(task.description || ''),
        category: getFormValues(task.category),
      });

      setTaskStep2({
        recurrence: getFormValues(task.recurrence),
        recurrenceValues: getFormValues(task.recurrenceValues),
        recurrenceInvalidDateStrategy: getFormValues(
          task.recurrenceInvalidDateStrategy
        ),
      });

      setTaskStep3({
        schedule: getFormValues(task.schedule),
        scheduleStartTime: getFormValues(task.scheduleStartTime),
        scheduleEndTime: getFormValues(task.scheduleEndTime),
        autoRemove: getFormValues(task.autoRemove),
        autoRemoveDate: getFormValues(task.autoRemoveDate),
      });
    };

    if (cacheById && cacheById[taskId]) {
      const task = cacheById[taskId];
      setTaskFormData(task);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    api
      .get(API_ENDPOINTS.GET_ONE_TASK, {
        signal: controller.signal,
        params: {
          taskId,
        },
      })
      .then((response) => {
        if (response.data?.success) {
          const task = response.data.task;
          setCacheById((pre) => {
            const obj = { ...(pre || {}) };
            obj[task._id] = task;
            return obj;
          });
          setTaskFormData(task);
        }
      })
      .catch((error) => {
        console.error('Error fetching task', error);
      })
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  const handleStep1Change = (e: CustomChangeEvent) => {
    const { name, value } = e.target;
    const key = name as keyof TaskFormStep1;

    validate({
      rules: taskStep1Rules,
      state: taskStep1,
      setState: setTaskStep1,
      newInput: [key, value],
      onlyValidateTouched: true,
    });
  };

  const handleStep1Submit = () => {
    const { isValid } = validate({
      rules: taskStep1Rules,
      state: taskStep1,
      setState: setTaskStep1,
      onlyValidateTouched: false,
    });

    if (isValid) {
      setStep(2);
    }
  };

  const handleStep2Change: (e: CustomChangeEvent) => void = (e) => {
    const { name, value } = e.target;
    const key = name as keyof TaskFormStep2;
    let finalValue = value;

    if (Array.isArray(finalValue)) {
      finalValue.sort((a, b) => a - b);
    }

    validate({
      rules: taskStep2Rules,
      state: taskStep2,
      setState: setTaskStep2,
      newInput: [key, finalValue],
      onlyValidateTouched: true,
      customValidators: {
        testRecurrenceValues,
      },
      argumentGetters: {
        getRecurrenceType,
      },
    });

    if (name === 'recurrence' && value !== taskStep2.recurrence.value) {
      setTaskStep2((pre) => ({
        ...pre,
        recurrenceValues: getFormValues(value === RECURRENCE.DAILY ? null : []),
        recurrenceInvalidDateStrategy: getFormValues(null),
      }));
      setShowInvalidDateOption(false);
      setCurrentMonth(0);
    }

    if (name === 'recurrenceValues') {
      const typeValue: number[] = value || [];
      let invalidDateStrategy: InvalidDateStrategyUnion = null;

      const includesInvalidMonthlyDate =
        typeValue.includes(29) ||
        typeValue.includes(30) ||
        typeValue.includes(31);

      const isInvalidMonth =
        taskStep2.recurrence.value === RECURRENCE.MONTHLY &&
        includesInvalidMonthlyDate;

      const isInvalidYear =
        taskStep2.recurrence.value === RECURRENCE.YEARLY &&
        typeValue.includes(129);

      if (isInvalidMonth || isInvalidYear) {
        invalidDateStrategy = INVALID_DATE_STRATEGY.SHIFT;
        setShowInvalidDateOption(true);
      } else {
        setShowInvalidDateOption(false);
      }
      setTaskStep2((pre) => ({
        ...pre,
        recurrenceInvalidDateStrategy: getFormValues(invalidDateStrategy),
      }));
    }
  };

  // TODO: SKIP is removed on values change

  const handleStep2Submit = () => {
    const { isValid } = validate({
      rules: taskStep2Rules,
      state: taskStep2,
      setState: setTaskStep2,
      onlyValidateTouched: false,
      customValidators: {
        testRecurrenceValues,
      },
      argumentGetters: {
        getRecurrenceType,
      },
    });

    if (isValid) {
      setStep(3);
    }
  };

  const handleStep3Change: (e: CustomChangeEvent) => void = (e) => {
    const { name, value } = e.target;
    const key = name as keyof TaskFormStep3;
    let finalValue = value;

    validate({
      rules: taskStep3Rules,
      state: taskStep3,
      setState: setTaskStep3,
      newInput: [key, finalValue],
      onlyValidateTouched: true,
      customValidators: {
        validateTime,
        validateRemoveDate,
      },
      argumentGetters: {
        getScheduleType,
        getAutoRemove,
      },
    });

    if (name === 'schedule' && value === SCHEDULE.NOT_TIMED) {
      setTaskStep3((pre) => ({
        ...pre,
        scheduleStartTime: getFormValues(null),
        scheduleEndTime: getFormValues(null),
      }));
    }

    if (name === 'autoRemove' && value === AUTO_REMOVE.NEVER) {
      setTaskStep3((pre) => ({
        ...pre,
        autoRemoveDate: getFormValues(null),
      }));
    }
  };

  const handleStep3Submit = () => {
    const { isValid } = validate({
      rules: taskStep3Rules,
      state: taskStep3,
      setState: setTaskStep3,
      onlyValidateTouched: false,
      customValidators: {
        validateTime,
        validateRemoveDate,
      },
      argumentGetters: {
        getScheduleType,
        getAutoRemove,
      },
    });

    if (isValid) {
      handleSubmit();
    }
  };

  const handleNextButton = () => {
    if (step === 1) {
      handleStep1Submit();
    } else if (step === 2) {
      handleStep2Submit();
    } else if (step === 3) {
      handleStep3Submit();
    }
  };

  const toYearlyDatesValues = (
    monthIndex: number,
    dates: number[],
    existingYearlyDates: number[]
  ) => {
    const datesWithoutCurrentMonth = existingYearlyDates.filter(
      (date: number) => monthIndex !== getMonthIndexFromYearlyDate(date)
    );

    const newDates = dates.map((date) => monthIndex * 100 + date);

    handleStep2Change({
      target: {
        value: [...datesWithoutCurrentMonth, ...newDates],
        name: 'recurrenceValues',
      },
    });
  };

  const handleSubmit = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      if (isEditMode && !taskId) {
        return;
      }

      const taskForm: TaskFormState = {
        ...taskStep1,
        ...taskStep2,
        ...taskStep3,
      };
      const taskData = extractValues(taskForm);
      let response: AxiosResponse<any, any> | null = null;

      if (isEditMode) {
        response = await api.patch(API_ENDPOINTS.UPDATE_TASK, taskData, {
          params: {
            taskId,
          },
        });
      } else {
        response = await api.post(API_ENDPOINTS.CREATE_TASK, taskData);
      }

      if (response?.data?.success) {
        setCacheByDate(null);
        setAllTasks(null);
        navigate(ROUTES.TASKS_TO_DO.path);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.taskFormWrapper}>
      {isEditMode && loading ? (
        <div className={styles.spinnerWrap}>
          <Spinner />
        </div>
      ) : isEditMode && !taskId ? (
        'Task id not found'
      ) : (
        <>
          {step === 1 && (
            <div className={styles.stepOneWrap}>
              <InputText
                type="text"
                value={taskStep1.name.value}
                onChange={handleStep1Change}
                placeholder="eg: Read a book"
                label="Name"
                id="name"
                name="name"
                error={taskStep1.name.error}
                required={true}
              />

              <InputText
                type="textarea"
                value={taskStep1.description.value}
                onChange={handleStep1Change}
                placeholder="Describe the task... (Optional)"
                label="Description"
                id="description"
                name="description"
                error={taskStep1.description.error}
              />

              {blockEditing && (
                <InfoText info="Below field can't be changed since the task already has a recorded score now" />
              )}
              <OptionGroup
                label="What type of task is this?"
                value={taskStep1.category.value}
                onChange={handleStep1Change}
                name="category"
                options={CATEGORY_OPTIONS}
                disabled={blockEditing}
              />
              <InfoText
                info={CATEGORY_INFO[taskStep1.category.value]}
                disabled={blockEditing}
              />
            </div>
          )}

          {step === 2 && (
            <>
              <div className={styles.stepOneWrap}>
                {blockEditing && (
                  <InfoText info="Below field can't be changed since the task already has a recorded score now" />
                )}

                <OptionGroup
                  label="How often are you going to do it?"
                  name="recurrence"
                  value={taskStep2.recurrence.value}
                  onChange={(e) => handleStep2Change(e)}
                  options={RECURRENCE_OPTIONS}
                  disabled={blockEditing}
                />

                {taskStep2.recurrence.value === RECURRENCE.WEEKLY ? (
                  <OptionGroup
                    label="On what days?"
                    name="recurrenceValues"
                    value={taskStep2.recurrenceValues.value || []}
                    onChange={(e) => handleStep2Change(e)}
                    options={WEEK_OPTIONS}
                    allowMulti={true}
                    error={taskStep2.recurrenceValues.error}
                    required={true}
                    disabled={blockEditing}
                  />
                ) : taskStep2.recurrence.value === RECURRENCE.MONTHLY ? (
                  <OptionGroup
                    label="On what dates every month?"
                    name="recurrenceValues"
                    value={taskStep2.recurrenceValues.value || []}
                    onChange={(e) => handleStep2Change(e)}
                    options={DATE_OPTIONS}
                    allowMulti={true}
                    inputLabelProps={{
                      className: styles.dateOption,
                    }}
                    error={taskStep2.recurrenceValues.error}
                    required={true}
                    disabled={blockEditing}
                  />
                ) : taskStep2.recurrence.value === RECURRENCE.YEARLY ? (
                  <>
                    <div>
                      <Label required={true} disabled={blockEditing}>
                        On what dates every year?
                      </Label>
                      <div
                        className={classes(
                          styles.monthWrap,
                          blockEditing && styles.disabled
                        )}
                        onClick={
                          blockEditing ? undefined : () => setOpenSelector(true)
                        }
                      >
                        {MONTHS[currentMonth as MonthIndex]}
                        <span
                          className={classes(
                            styles.monthText,
                            'material-symbols-outlined'
                          )}
                        >
                          expand_all
                        </span>
                      </div>
                      <MonthSelectorModal
                        open={openSelector}
                        setOpen={setOpenSelector}
                        value={currentMonth as MonthIndex}
                        onChange={(e) => setCurrentMonth(e.target.value)}
                        name="currentMonth"
                      />
                      <OptionGroup
                        name="recurrenceValues"
                        value={extractMonthlyDates(
                          currentMonth,
                          taskStep2.recurrenceValues.value || []
                        )}
                        onChange={(e) =>
                          toYearlyDatesValues(
                            currentMonth as MonthIndex,
                            e.target.value,
                            taskStep2.recurrenceValues.value || []
                          )
                        }
                        options={getDateOptions(currentMonth as MonthIndex)}
                        allowMulti={true}
                        inputLabelProps={{
                          className: styles.dateOption,
                        }}
                        error={taskStep2.recurrenceValues.error}
                        disabled={blockEditing}
                      />
                    </div>
                    {!!(taskStep2.recurrenceValues.value || []).length && (
                      <div>
                        <Label>Selected Dates:</Label>
                        <div className={styles.dateValues}>
                          {(taskStep2.recurrenceValues.value || []).map(
                            (date) => {
                              const monthIndex =
                                getMonthIndexFromYearlyDate(date);
                              const monthlyDate = getDateFromYearlyDate(date);
                              return (
                                <span key={date} className={styles.dateValue}>
                                  {MONTHS_3_LETTER[monthIndex]} {monthlyDate}
                                </span>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : null}

                {taskStep2.recurrenceInvalidDateStrategy.value !== null &&
                  showInvalidDateOption && (
                    <>
                      <OptionGroup
                        label="Choose missing date strategy"
                        name="recurrenceInvalidDateStrategy"
                        value={taskStep2.recurrenceInvalidDateStrategy.value}
                        onChange={(e) => handleStep2Change(e)}
                        options={INVALID_DATE_STRATEFY_OPTIONS}
                        required={true}
                        disabled={blockEditing}
                      />
                      <InfoText
                        info={
                          INVALID_DATE_STRATEGY_INFO[
                            taskStep2.recurrenceInvalidDateStrategy
                              .value as InvalidDateStrategyEnum
                          ]
                        }
                        onClick={
                          blockEditing
                            ? undefined
                            : () => setShowStrategyGuide(true)
                        }
                        disabled={blockEditing}
                      />
                      <Modal
                        title="Missing date strategy guide"
                        open={showStrategyGuide}
                        onClose={() => setShowStrategyGuide(false)}
                      >
                        <StrategyInfo />
                      </Modal>
                    </>
                  )}
              </div>
            </>
          )}

          {step === 3 && (
            <div className={styles.stepOneWrap}>
              <OptionGroup
                label="When are you going to do it?"
                name="schedule"
                value={taskStep3.schedule.value}
                onChange={handleStep3Change}
                options={SCHEDULE_OPTIONS}
              />

              {taskStep3.schedule.value === SCHEDULE.TIMED && (
                <div className={styles.timeRow}>
                  <TimeSelector
                    value={taskStep3.scheduleStartTime.value}
                    onChange={handleStep3Change}
                    name="scheduleStartTime"
                    error={taskStep3.scheduleStartTime.error}
                    label="From time"
                    required={true}
                  />

                  <TimeSelector
                    value={taskStep3.scheduleEndTime.value}
                    onChange={handleStep3Change}
                    name="scheduleEndTime"
                    error={taskStep3.scheduleEndTime.error}
                    label="To time"
                    required={true}
                  />
                </div>
              )}

              <OptionGroup
                label="Automatically remove this task later?"
                name="autoRemove"
                value={taskStep3.autoRemove.value}
                onChange={handleStep3Change}
                options={[
                  { id: AUTO_REMOVE.NEVER, label: 'No' },
                  {
                    id: AUTO_REMOVE.AFTER_GIVEN_DATE,
                    label: 'Yes',
                  },
                ]}
              />

              {taskStep3.autoRemove.value === AUTO_REMOVE.AFTER_GIVEN_DATE && (
                <>
                  <InputText
                    label="When?"
                    type="text"
                    placeholder="Select Date"
                    name="select-date"
                    readOnly={true}
                    required={true}
                    value={getDateString(taskStep3.autoRemoveDate.value)}
                    error={taskStep3.autoRemoveDate.error}
                    onClick={() => setShowDateSelector(true)}
                  />
                  <DateSelector
                    value={taskStep3.autoRemoveDate.value}
                    onChange={(date) =>
                      handleStep3Change({
                        target: { name: 'autoRemoveDate', value: date },
                      })
                    }
                    open={showDateSelector}
                    setOpen={setShowDateSelector}
                  />
                </>
              )}
            </div>
          )}

          <div className={styles.fade}></div>

          {step !== 1 && (
            <Fab
              disabled={loading}
              position={FAB_POSITION.LEFT}
              fabType={FAB_TYPE.SECONDARY}
              onClick={() => setStep(step - 1)}
            >
              west
            </Fab>
          )}

          <Fab loading={loading} disabled={loading} onClick={handleNextButton}>
            {step === 3 ? 'done' : 'east'}
          </Fab>
        </>
      )}
    </div>
  );
};

export default TaskForm;
