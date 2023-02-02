/**
 * @file Courses Pid Page
 *
 * more info on selected courses
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
import { useNavigate, useParams } from "react-router-dom";
import useApi from "hooks/useApi";
import { useAuth } from "contexts/authContext";
import style from "style/pages/courses/course.module.scss";

import _ from "lodash";
import Select from "components/select/Select";
import Input from "components/input/Input";
import Button from "components/button/Button";
import EditorParser from "editor/EditorParser";
import Popup from "components/popup/Popup";
import Table from "components/tableV2/Table";
import Loading from "components/loading/Loading";

type Props = {};

const CoursePid = (props: Props) => {
  const { pid } = useParams<"pid">();
  const { RegistrationApi, SyllabusApi } = useApi();
  const navigate = useNavigate();
  const { currentUser, currentSeason } = useAuth();

  const [courseData, setCourseData] = useState<any>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingTimeClassroomRef, setIsLoadingTimeClassroomRef] =
    useState<boolean>(false);
  const [isLoadingMentorRef, setIsLoadingMentorRef] = useState<boolean>(false);

  /* additional document list */
  const [syllabusList, setSyllabusList] = useState<any>();
  const teacherListRef = useRef<any[]>([]);

  const [courseSubject, setCourseSubject] = useState<string>("");
  const [courseTitle, setCourseTitle] = useState<string>("");
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

  function syllabusToTime(s: any) {
    let result = {};
    if (s) {
      for (let i = 0; i < s.length; i++) {
        const element = s[i];
        for (let ii = 0; ii < element.time.length; ii++) {
          Object.assign(result, {
            [element.time[ii].label]: element.classTitle + "(" + element.classroom + ")",
          });
        }
      }
    }

    return result;
  }

  async function update() {
    return await SyllabusApi.USyllabus({
      _id: courseData._id,
      data: {
        classTitle: courseTitle,
        point: Number(coursePoint),
        subject: courseSubject.split("/"),
        teachers: courseMentorList,
        classroom: courseClassroom,
        time: Object.values(courseTime),
        info: courseMoreInfo,
        limit: Number(courseLimit),
      },
    });
  }

  const subjects = () => {
    const res = [];
    for (let i = 0; i < currentSeason?.subjects.data.length; i++) {
      const value = _.join(currentSeason?.subjects.data[i], "/");
      res.push({
        text: value,
        value,
      });
    }
    return res;
  };

  useEffect(() => {
    if (isLoading) {
      SyllabusApi.RSyllabus(pid)
        .then((result) => {
          if (
            result.season !== currentSeason._id ||
            result.user !== currentUser._id
          ) {
            navigate("/courses#개설%20수업", { replace: true });
          }

          setCourseData(result);
          setCourseSubject(_.join(result.subject, "/"));
          setCourseTitle(result.classTitle);
          setCourseMentorList(result.teachers || []);
          setCoursePoint(result.point || 0);
          setCourseTime(_.keyBy(result.time, "label"));
          setCourseClassroom(result.classroom);
          setCourseMoreInfo(result.info || {});
          setCourseLimit(result.limit || 0);

          RegistrationApi.RRegistrations({
            season: result.season,
            role: "teacher",
          }).then((res) => {
            for (let teacher of result.teachers) {
              const idx = _.findIndex(res, { user: teacher._id });

              if (idx !== -1) {
                res[idx].tableRowChecked = true;
              }
            }
            teacherListRef.current = res;
          });
        })
        .then(() => setIsLoadingTimeClassroomRef(true))
        .then(() => setIsLoading(false))
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
    if (isLoadingMentorRef) {
      setIsLoadingMentorRef(false);
    }
    return () => {};
  }, [isLoadingMentorRef]);

  useEffect(() => {
    setCoursePoint(`${Object.keys(courseTime).length}`);
    return () => {};
  }, [courseTime]);

  return !isLoading && !isLoadingTimeClassroomRef && !isLoadingMentorRef ? (
    <>
      <div className={style.section}>
        <div className={style.design_form}>
          <div className={style.title}>강의계획서 수정</div>
          <div style={{ display: "flex", gap: "24px" }}>
            <Select
              appearence="flat"
              label={_.join(currentSeason?.subjects.label, "/")}
              required
              setValue={setCourseSubject}
              options={subjects()}
              defaultSelectedValue={courseSubject}
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
              defaultValue={`${currentUser?.userName}(${currentUser?.userId})`}
            />

            <Input
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
            onClick={() => {
              setTimeSelectPopupActive(true);
            }}
          >
            강의실 및 시간 선택
          </Button>
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
              defaultValue={"0"}
            />
          </div>
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

              if (!courseTitle || courseTitle === "") {
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
                  .then((res: any) => {
                    navigate(`/courses/created/${pid}`, { replace: true });
                  })
                  .catch((err) => {
                    alert(err);
                  });
            }}
          >
            수정
          </Button>

          <Button
            style={{ marginTop: "24px" }}
            type="ghost"
            onClick={() => {
              navigate(`/courses/created/${pid}`, { replace: true });
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
              SyllabusApi.RSyllabuses({
                season: currentSeason?._id,
                classroom: courseClassroomRef.current,
              }).then(({ syllabuses }) => {
                setSyllabusList(syllabuses);
              });
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
        <Popup
          contentScroll
          setState={setMentorSelectPopupActive}
          title="멘토 선택"
          closeBtn
          style={{ borderRadius: "4px", width: "900px" }}
          footer={
            <Button
              type="ghost"
              onClick={() => {
                setCourseMentorList(
                  _.filter(teacherListRef.current, {
                    tableRowChecked: true,
                  }).map((val: any) => {
                    return {
                      _id: val.user,
                      userId: val.userId,
                      userName: val.userName,
                    };
                  })
                );
                setIsLoadingMentorRef(true);
                setMentorSelectPopupActive(false);
              }}
            >
              선택
            </Button>
          }
        >
          <Table
            data={teacherListRef.current}
            type="object-array"
            control
            onChange={(value: any[]) => {
              teacherListRef.current = value;
            }}
            header={[
              {
                text: "checkbox",
                key: "",
                type: "checkbox",
                width: "48px",
              },

              {
                text: "선생님 ID",
                key: "userId",
                type: "text",
                textAlign: "center",
              },
              {
                text: "선생님 이름",
                key: "userName",
                type: "text",
                textAlign: "center",
              },
            ]}
          />
          {/* <TableV2
            data={teacherList}
            type="object-array"
            control
            // onSelectChange={(value: any) => {
            //   selectedRegistrations.current = value.map((val: any) => {
            //     return val._id;
            //   });
            // }}
            header={[
              {
                text: "checkbox",
                key: "",
                type: "checkbox",
                width: "48px",
              },

              {
                text: "선생님 ID",
                key: "userId",
                type: "text",
                textAlign: "center",
              },
              {
                text: "선생님 이름",
                key: "userName",
                type: "text",
                textAlign: "center",
              },
            ]}
          /> */}
        </Popup>
      )}
    </>
  ) : (
    <Loading height={"calc(100vh - 55px)"} />
  );
};

export default CoursePid;
