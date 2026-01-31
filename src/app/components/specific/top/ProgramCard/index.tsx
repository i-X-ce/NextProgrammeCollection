"use client";

import { Button, Divider, IconButton, Modal } from "@mui/material";
import styles from "./style.module.css";
import { motion, Transition } from "motion/react";
import { useState } from "react";
import {
  CalendarMonth,
  Close,
  People,
  Person,
  Timer,
} from "@mui/icons-material";

const transition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
};

export default function ProgramCard({
  title,
  subTitle,
  url,
  description,
  detailDescription,
  img,
  imgpos = "top left",
  imgpos2 = "top left",
  tags,
  date,
  numberOfDevs = 1,
  period,
}: {
  title: string;
  subTitle: string;
  url?: string;
  description: string;
  detailDescription?: string;
  img?: string;
  imgpos?: string;
  imgpos2?: string;
  tags: string[];
  date?: { start: string; end?: string };
  numberOfDevs?: number;
  period?: string;
}) {
  const [open, setOpen] = useState(false);
  // const router = useRouter();
  const getLayoutId: (title: string) => string = (name: string) => {
    return `${title}-${name}`;
  };

  // const handleShowClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.stopPropagation();
  //   if (!url) return;
  //   router.push(url);
  // };

  return (
    <motion.div whileHover="hover" onClick={() => setOpen(!open)}>
      {!open && (
        <motion.div
          className={styles.card}
          variants={{ hover: { scale: 1.05, rotate: 3 } }}
          transition={transition}
          layoutId={getLayoutId("card")}
        >
          <motion.div
            className={styles.img}
            style={
              img
                ? { backgroundImage: `url(${img})`, backgroundPosition: imgpos }
                : {}
            }
            layoutId={getLayoutId("img")}
            transition={transition}
          />
          <span className="flex flex-col justify-between">
            <div className={styles.textContainer}>
              <p className={styles.subTitle}>{subTitle}</p>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.description}>{description}</p>
              <div className={styles.tags}>
                {tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              {/* <p className={styles.date}>{date}</p> */}
            </div>

            {/* <a href={url} className={styles.link}>
            詳細を見る
          </a> */}
          </span>
          <div className="flex flex-col ">
            <Divider />
            <Button
              href={url}
              sx={{ borderRadius: 0 }}
              disabled={!url}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              見てみる
            </Button>
          </div>
        </motion.div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className="flex items-center justify-center"
      >
        <motion.div
          layoutId={getLayoutId("card")}
          className={styles.modalCard}
          transition={transition}
          onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
        >
          <motion.div
            className={styles.modalImg}
            style={
              img
                ? {
                    backgroundImage: `url(${img})`,
                    backgroundPosition: imgpos2,
                  }
                : {}
            }
            layoutId={getLayoutId("img")}
            transition={transition}
          />
          <IconButton
            sx={{ position: "absolute", top: 20, right: 20 }}
            onClick={() => setOpen(false)}
          >
            <Close />
          </IconButton>

          <div className="flex flex-col justify-between flex-1 p-5">
            <div className={styles.modalTextContainer}>
              <div>
                <p className={styles.subTitle}>{subTitle}</p>
                <h1 className={styles.modalTitle}>{title}</h1>
              </div>

              <div className={`${styles.tags}`}>
                {tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 flex-wrap mb-3">
                <div className={styles.modalData}>
                  {numberOfDevs > 1 ? (
                    <People color="inherit" />
                  ) : (
                    <Person color="inherit" />
                  )}
                  <p>{numberOfDevs}人</p>
                </div>
                {date && (
                  <div className={styles.modalData}>
                    <CalendarMonth color="inherit" />
                    <p>
                      {date?.start} ~ {date?.end}
                    </p>
                  </div>
                )}
                {period && (
                  <div className={styles.modalData}>
                    <Timer color="inherit" />
                    <p>{period}</p>
                  </div>
                )}
              </div>
              <p>{detailDescription}</p>
            </div>
            <div className="flex justify-end">
              <Button href={url} variant="contained" disabled={!url}>
                見てみる
              </Button>
            </div>
          </div>
        </motion.div>
      </Modal>
    </motion.div>
  );
}
