import React, { useState, useEffect } from "react";
import { useForm, useFormState } from "react-hook-form";
import styles from "./ElogbookAdmin.module.css";

import axios from "axios";
import InfoTable from "../../../components/tabels/InfoTable";

const ElogbookAdmin = () => {
  const [stations, setStations] = useState();
  const [diseases, setDiseases] = useState();
  const [skills, setSkills] = useState();
  const [hospitals, setHospitals] = useState();
  const [guidances, setGuidances] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { watch, register, handleSubmit, control, setValue, getValues } =
    useForm({
      defaultValues: {
        requestType: "post",
      },
    });
  const { dirtyFields } = useFormState({ control });

  const objectType = watch("objectType");
  const requestType = watch("requestType");

  const baseUrl =
    (import.meta.env.VITE_API_URL &&
      `${import.meta.env.VITE_API_URL}/api/admin`) ||
    "http://localhost:5000/api/admin";

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${baseUrl}/elogbook`, {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setStations(res.data.stations);
        setDiseases(res.data.diseases);
        setSkills(res.data.skills);
        setHospitals(res.data.hospitals);
        setGuidances(res.data.guidances);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const ObjectRequestHandler = (data) => {
    setIsLoading(true);
    console.log(requestType);
    console.log(objectType);
    console.log(data);
    if (objectType === "" || !objectType) return;

    let submittedData = null;

    if (requestType === "post") {
      submittedData =
        objectType === "disease" || objectType === "skill"
          ? { name: data.name, station: data.station }
          : { name: data.name };
    } else if (requestType === "patch") {
      submittedData =
        objectType === "disease" || objectType === "skill"
          ? { id: data.id, name: data.name, station: data.station }
          : { id: data.id, name: data.name };
    } else if (requestType === "delete") {
      submittedData = {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      };
    }

    axios[requestType](
      `${baseUrl}/${objectType}${
        requestType === "delete" ? `/${data.id}` : ""
      }`,
      submittedData,
      !(requestType === "delete")
        ? {
            headers: {
              "auth-token": localStorage.getItem("token"),
            },
          }
        : null
    )
      .then((res) => {
        console.log(res);
        return axios.get(`${baseUrl}/elogbook`, {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        });
      })
      .then((res) => {
        console.log(res);
        setStations(res.data.stations);
        setDiseases(res.data.diseases);
        setSkills(res.data.skills);
        setHospitals(res.data.hospitals);
        setGuidances(res.data.guidances);
        setIsLoading(false);
        setValue("requestType", "post");
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <label htmlFor="objectType">Pilih Kategori</label>
      <select id="objectType" {...register("objectType")}>
        {!dirtyFields.objectType && <option value={""}>Pilih Kategori</option>}
        <option value="station">Stase</option>
        <option value="disease">Penyakit</option>
        <option value="skill">Keterampilan</option>
        <option value="guidance">Metode Pembelajaran</option>
        <option value="hospital">Rumah Sakit</option>
      </select>

      {objectType && (
        <div className={styles["form-container"]}>
          <h2>
            {(requestType === "post" && "Tambah") ||
              (requestType === "patch" && "Edit") ||
              (requestType === "delete" && "Hapus")}{" "}
            {(objectType === "station" && "Stase") ||
              (objectType === "disease" && "Penyakit") ||
              (objectType === "skill" && "Keterampilan") ||
              (objectType === "guidance" && "Metode Pembelajaran") ||
              (objectType === "hospital" && "Rumah Sakit")}
          </h2>
          <form
            onSubmit={handleSubmit(ObjectRequestHandler)}
            id="form"
            className={styles.form}
          >
            <input hidden type="text" {...register("id")} />

            {(requestType === "post" || requestType === "patch") && (
              <>
                <div className={styles["input-container"]}>
                  <label htmlFor="name">Nama</label>
                  <input type="text" id="name" {...register("name")} />
                </div>
              </>
            )}

            {(objectType === "disease" || objectType === "skill") &&
              requestType !== "delete" && (
                <>
                  <div className={styles["input-container"]}>
                    <label htmlFor="stationId">Stase</label>
                    <select id="stationId" {...register("station")}>
                      {!dirtyFields.stationId && (
                        <option value={""}>Pilih Stase</option>
                      )}
                      {stations &&
                        stations.map((station) => (
                          <option key={station.id} value={station.id}>
                            {station.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </>
              )}
            {requestType === "delete" ? (
              <div className={styles["form-button"]}>
                <p>Apakah Anda Yakin Ingin Menghapus {getValues("name")}</p>
                <input hidden type="text" {...register("id")} />
                <div className={styles["button-container"]}>
                  <button className={styles["button-green"]} type="submit">
                    Ya
                  </button>
                  <button
                    className={styles["button-red"]}
                    onClick={() => setValue("requestType", "post")}
                    type="reset"
                  >
                    Tidak
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles["button-container"]}>
                <button className={styles["button-green"]}>Submit</button>
              </div>
            )}
          </form>
        </div>
      )}
      {objectType ? (
        !isLoading ? (
          <div>
            <InfoTable
              stations={stations}
              objectType={objectType}
              setValue={setValue}
              objectData={
                (objectType === "station" && stations) ||
                (objectType === "disease" && diseases) ||
                (objectType === "skill" && skills) ||
                (objectType === "guidance" && guidances) ||
                (objectType === "hospital" && hospitals)
              }
            />
          </div>
        ) : (
          <>
            <p>Loading ...</p>
          </>
        )
      ) : null}
      {/* 
      TODO: Download as excel file
       */}
    </div>
  );
};

export default ElogbookAdmin;
