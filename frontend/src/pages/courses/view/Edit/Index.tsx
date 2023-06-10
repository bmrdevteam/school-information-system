/**
 * @file Course Edit View
 * @page 개설/멘토링 수업 수정 뷰
 *
 * @author jessie129j <jessie129j@gmail.com>
 *
 * -------------------------------------------------------
 *
 * IN PRODUCTION
 *
 * -------------------------------------------------------
 *
 * IN MAINTENANCE
 *
 * -------------------------------------------------------
 *
 * IN DEVELOPMENT
 *
 * -------------------------------------------------------
 *
 * DEPRECATED
 *
 * -------------------------------------------------------
 *
 * NOTES
 *
 * @version 1.0
 *
 */
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useApi from "hooks/useApi";
import { useAuth } from "contexts/authContext";
import style from "style/pages/courses/course.module.scss";

import _ from "lodash";
import Select from "components/select/Select";
import Input from "components/input/Input";
import Button from "components/button/Button";
import EditorParser from "editor/EditorParser";
import Popup from "components/popup/Popup";
import Loading from "components/loading/Loading";
import Callout from "components/callout/Callout";

import MentoringTeacherPopup from "pages/courses/view/_components/MentoringTeacherPopup";
import UpdatedEvaluationPopup from "pages/courses/view/_components/UpdatedEvaluationPopup";
import SubjectSelect from "pages/courses/view/_components/SubjectSelect";

import useAPIv2 from "hooks/useAPIv2";

type Props = {};

const CoursePid = (props: Props) => {
  const { pid } = useParams<"pid">();
  const [searchParams] = useSearchParams();
  const byMentor = searchParams.get("byMentor") === "true";
  const strictMode = searchParams.get("strictMode") === "true";

  const { SyllabusApi } = useApi();
  const { RegistrationAPI } = useAPIv2();

  const navigate = useNavigate();
  const { currentUser, currentSeason } = useAuth();

  const [courseData, setCourseData] = useState<any>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingTimeClassroomRef, setIsLoadingTimeClassroomRef] =
    useState<boolean>(false);

  /* additional document list */
  const [syllabusList, setSyllabusList] = useState<any>();
  const teacherListRef = useRef<any[]>([]);

  const [courseSubject, setCourseSubject] = useState<string[]>([]);
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [courseUserId, setCourseUserId] = useState<string>("");
  const [courseUserName, setCourseUserName] = useState<string>("");
  const [courseMentorList, setCourseMentorList] = useState<any[]>([]);

  const [coursePoint, setCoursePoint] = useState<string>("");
  const [courseTime, setCourseTime] = useState<any>({});
  const [courseClassroom, setCourseClassroom] = useState<string>("");
  const [courseMoreInfo, setCourseMoreInfo] = useState<any>({});
  const [courseLimit, setCourseLimit] = useState<string>("");

  const courseClassroomRef = useRef<any>("");
  const courseTimeRef = useRef<any>({});

  const [timeSelectPopupActive, setTimeSelectPopupActive] =
    useState<boolean>(false);
  const [mentorSelectPopupActive, setMentorSelectPopupActive] =
    useState<boolean>(false);

  const [changes, setChanges] = useState<any[]>([]);
  const [changesPoupActive, setChangesPopupActive] = useState<boolean>(false);

  function syllabusToTime(s: any) {
    let result = {};
    if (s) {
      for (let i = 0; i < s.length; i++) {
        const element = s[i];
        for (let ii = 0; ii < element.time.length; ii++) {
          Object.assign(result, {
            [element.time[ii].label]:
              element.classTitle + "(" + element.classroom + ")",
          });
        }
      }
    }

    return result;
  }

  async function update() {
    const res1 = await SyllabusApi.USyllabus({
      _id: courseData._id,
      data: {
        classTitle: courseTitle,
        point: Number(coursePoint),
        subject: courseSubject,
        teachers: courseMentorList,
        classroom: courseClassroom,
        time: Object.values(courseTime),
        info: courseMoreInfo,
        limit: Number(courseLimit),
      },
    });
    const res2 = strictMode
      ? await SyllabusApi.USyllabusSubject({
          _id: courseData._id,
          data: {
            subject: courseSubject,
          },
        })
      : undefined;

    return { res1, res2 };
  }

  useEffect(() => {
    if (isLoading && currentSeason && currentUser) {
      SyllabusApi.RSyllabus(pid)
        .then((result) => {
          if (
            result.user !== currentUser._id &&
            !_.find(result.teachers, { _id: currentUser._id })
          ) {
            navigate("/courses#개설%20수업", { replace: true });
          }
          setCourseData(result);
          setCourseSubject(result.subject);
          setCourseTitle(result.classTitle);
          setCourseUserId(result.userId);
          setCourseUserName(result.userName);
          setCourseMentorList(result.teachers || []);
          setCoursePoint(result.point || 0);
          setCourseTime(_.keyBy(result.time, "label"));
          setCourseClassroom(
            currentSeason.classrooms.includes(result.classroom)
              ? result.classroom
              : ""
          );
          setCourseMoreInfo(result.info || {});
          setCourseLimit(result.limit || 0);

          RegistrationAPI.RRegistrations({
            query: { season: result.season, role: "teacher" },
          }).then(({ registrations: teacherRegistrations }) => {
            const teachers = teacherRegistrations.map((reg) => {
              return { ...reg, tableRowChecked: false };
            });

            for (let teacher of result.teachers) {
              const idx = _.findIndex(teachers, { user: teacher._id });

              if (idx !== -1) {
                teachers[idx].tableRowChecked = true;
              }
            }
            teacherListRef.current = teachers;
          });
        })
        .then(() => setIsLoadingTimeClassroomRef(true))
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          alert("failed to load data");
          navigate("/courses");
        });
    }
    return () => {};
  }, [isLoading]);

  useEffect(() => {
    if (isLoadingTimeClassroomRef) {
      courseTimeRef.current = { ...courseTime };
      courseClassroomRef.current = courseClassroom;
      setIsLoadingTimeClassroomRef(false);
    }
    return () => {};
  }, [isLoadingTimeClassroomRef]);

  useEffect(() => {
    setCoursePoint(`${Object.keys(courseTime).length}`);
    return () => {};
  }, [courseTime]);

  return !isLoading ? (
    <>
      <div className={style.section}>
        <div className={style.design_form}>
          <div className={style.title}>강의계획서 수정</div>
          {strictMode && (
            <Callout
              style={{ marginBottom: "24px" }}
              type={"warning"}
              title={"수강생이 있는 강의계획서의 수정하는 경우"}
              child={
                <ol>
                  <li>
                    <b>교과목</b>을 변경하면 평가 정보가 변경될 수 있습니다.
                  </li>
                  <li>
                    <b>강의실 및 시간</b>을 변경할 수 없습니다.
                  </li>
                  <li>
                    <b>수강 정원</b>을 수강생 수보다 작게 변경할 수 없습니다.
                  </li>
                </ol>
              }
              showIcon
            />
          )}
          <div key="subject-select-wrapper">
            <SubjectSelect
              subjectLabelList={currentSeason?.subjects?.label ?? []}
              subjectDataList={currentSeason?.subjects?.data ?? []}
              defaultSubject={courseSubject}
              setSubject={setCourseSubject}
            />
          </div>
          <div style={{ display: "flex", gap: "24px", marginTop: "24px" }}>
            <Input
              appearence="flat"
              label="수업명"
              required={true}
              onChange={(e: any) => {
                setCourseTitle(e.target.value);
              }}
              defaultValue={courseTitle}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "24px",
              alignItems: "flex-end",
            }}
          >
            <Input
              appearence="flat"
              label="작성자"
              required={true}
              disabled
              defaultValue={`${courseUserName}(${courseUserId})`}
            />

            <Input
              key={"mentor-" + JSON.stringify(courseMentorList)}
              appearence="flat"
              label="멘토"
              required
              defaultValue={_.join(
                courseMentorList.map(
                  (teacher: any) => `${teacher.userName}(${teacher.userId})`
                ),
                ", "
              )}
              disabled
            />
            <Button
              type="ghost"
              onClick={() => {
                setMentorSelectPopupActive(true);
              }}
            >
              수정
            </Button>
          </div>
          <Button
            style={{ flex: "1 1 0 ", marginTop: "24px" }}
            type="ghost"
            disabled={strictMode}
            onClick={() => {
              if (courseClassroomRef.current !== "") {
                SyllabusApi.RSyllabuses({
                  season: currentSeason?._id,
                  classroom: courseClassroomRef.current,
                }).then(({ syllabuses }) => {
                  setSyllabusList(syllabuses);
                });
              }

              courseTimeRef.current = { ...courseTime };
              setTimeSelectPopupActive(true);
            }}
          >
            강의실 및 시간 선택
          </Button>
          {!isLoadingTimeClassroomRef && (
            <div style={{ display: "flex", marginTop: "20px", gap: "24px" }}>
              <Input
                appearence="flat"
                label="강의실"
                defaultValue={courseClassroom}
                required={true}
                disabled
              />
              <Input
                appearence="flat"
                label="시간"
                defaultValue={_.join(Object.keys(courseTime), ", ")}
                required={true}
                disabled
              />
              <Input
                type="number"
                appearence="flat"
                label="학점"
                required={true}
                onChange={(e: any) => {
                  setCoursePoint(e.target.value);
                }}
                defaultValue={`${coursePoint}`}
              />

              <Input
                type="number"
                appearence="flat"
                label="수강정원"
                required={true}
                onChange={(e: any) => {
                  setCourseLimit(e.target.value);
                }}
                defaultValue={`${courseLimit}`}
              />
            </div>
          )}
          <div style={{ display: "flex", marginTop: "24px" }}></div>
          <EditorParser
            type="syllabus"
            auth="edit"
            onChange={(data) => {
              setCourseMoreInfo(data);
            }}
            defaultValues={courseMoreInfo}
            data={currentSeason?.formSyllabus}
          />

          <Button
            style={{ marginTop: "24px" }}
            type="ghost"
            onClick={() => {
              function isPositiveInteger(str: string) {
                const num = Number(str);
                return Number.isInteger(num) && num >= 0;
              }
              if (!courseSubject || courseSubject.includes("")) {
                alert("교과목을 입력해주세요.");
              } else if (!courseTitle || courseTitle === "") {
                alert("제목을 입력해주세요.");
              } else if (courseMentorList.length === 0) {
                alert("멘토를 선택해주세요.");
              } else if (Object.keys(courseTime).length === 0) {
                alert("시간을 선택해주세요.");
              } else if (!isPositiveInteger(coursePoint)) {
                alert("학점을 0 또는 양수로 입력해주세요.");
              } else if (!isPositiveInteger(courseLimit)) {
                alert("수강정원을 0 또는 양수로 입력해주세요.");
              } else
                update()
                  .then(({ res1, res2 }) => {
                    alert(SUCCESS_MESSAGE);
                    if (!byMentor)
                      navigate(`/courses/created/${pid}`, { replace: true });
                    if (byMentor) {
                      if (res2?.changes && res2.changes.length > 0) {
                        setChanges(res2.changes);
                        setChangesPopupActive(true);
                      } else {
                        navigate(`/courses/mentoring/${pid}`, {
                          replace: true,
                        });
                      }
                    }
                  })
                  .catch((err) => {
                    alert(
                      err?.response?.data?.message ?? "에러가 발생했습니다."
                    );
                  });
            }}
          >
            수정
          </Button>

          <Button
            style={{ marginTop: "12px" }}
            type="ghost"
            onClick={() => {
              if (!byMentor)
                navigate(`/courses/created/${pid}`, { replace: true });
              if (byMentor)
                navigate(`/courses/mentoring/${pid}`, { replace: true });
            }}
          >
            취소
          </Button>
        </div>
      </div>

      {timeSelectPopupActive && (
        <Popup
          setState={setTimeSelectPopupActive}
          title="강의실 및 시간 선택"
          closeBtn
          style={{ borderRadius: "4px", width: "900px" }}
          contentScroll
          footer={
            <Button
              type="ghost"
              onClick={() => {
                setIsLoadingTimeClassroomRef(true);
                setCourseClassroom(courseClassroomRef.current);
                setCourseTime({ ...courseTimeRef.current });
                setTimeSelectPopupActive(false);
              }}
            >
              선택
            </Button>
          }
        >
          <Select
            appearence="flat"
            options={[
              { value: "", text: "" },
              ...currentSeason?.classrooms?.map((val: any) => {
                return { value: val, text: val };
              }),
            ]}
            onChange={(e: any) => {
              courseClassroomRef.current = e;
              if (e !== "") {
                SyllabusApi.RSyllabuses({
                  season: currentSeason?._id,
                  classroom: courseClassroomRef.current,
                }).then(({ syllabuses }) => {
                  setSyllabusList(syllabuses);
                });
              } else {
                setSyllabusList([]);
              }
              courseTimeRef.current = [];
            }}
            defaultSelectedValue={courseClassroom}
            label="강의실 선택"
            required
          />
          <div style={{ height: "24px" }}></div>
          <EditorParser
            type="timetable"
            auth="edit"
            onChange={(data) => {
              Object.assign(courseTimeRef.current, data);
            }}
            defaultTimetable={syllabusToTime(
              _.filter(
                syllabusList,
                (syllabus: any) => syllabus._id !== courseData._id
              )
            )}
            defaultValues={courseTimeRef.current}
            data={currentSeason?.formTimetable}
          />
        </Popup>
      )}
      {mentorSelectPopupActive && (
        <MentoringTeacherPopup
          setPopupActive={setMentorSelectPopupActive}
          selectedTeachers={courseMentorList}
          setCourseMentorList={setCourseMentorList}
        />
      )}
      {changesPoupActive && pid && (
        <UpdatedEvaluationPopup
          pid={pid}
          changes={changes}
          setPopupActive={setChangesPopupActive}
        />
      )}
    </>
  ) : (
    <Loading height={"calc(100vh - 55px)"} />
  );
};

export default CoursePid;
