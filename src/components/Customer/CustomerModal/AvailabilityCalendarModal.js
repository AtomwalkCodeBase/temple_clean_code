"use client";

import { useMemo, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiCheck,
} from "react-icons/fi";

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  width: min(800px, 96vw);
  max-height: 90vh;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);

  .title {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 800;
    color: #1e293b;
    font-size: 1.4rem;

    svg {
      color: #667eea;
    }
  }
`;

const CloseButton = styled.button`
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #64748b;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
    color: #475569;
    transform: rotate(90deg);
  }
`;

const Body = styled.div`
  padding: 1.5rem 2rem;
  overflow-y: auto;
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  .title {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 800;
    color: #1e293b;
    font-size: 1.3rem;
  }

  .nav {
    display: inline-flex;
    gap: 0.5rem;

    button {
      background: rgba(102, 126, 234, 0.1);
      border: 1px solid rgba(102, 126, 234, 0.2);
      color: #667eea;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(102, 126, 234, 0.2);
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  div {
    text-align: center;
    font-weight: 700;
    color: #64748b;
    font-size: 0.9rem;
    padding: 0.5rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const DayCell = styled(motion.button)`
  aspect-ratio: 1/1;
  border: 1px solid
    ${(p) => (p.disabled ? "rgba(0, 0, 0, 0.05)" : "rgba(0, 0, 0, 0.1)")};
  border-radius: 16px;
  background: ${(p) => {
    if (p.selected) return "linear-gradient(135deg, #667eea, #764ba2)";
    if (p.disabled) return "rgba(0, 0, 0, 0.03)";
    if (p.isToday) return "rgba(102, 126, 234, 0.1)";
    return "transparent";
  }};
  color: ${(p) => {
    if (p.selected) return "white";
    if (p.disabled) return "#cbd5e1";
    if (p.isToday) return "#667eea";
    return "#374151";
  }};
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    ${(p) =>
      !p.disabled &&
      !p.selected &&
      `
      background: rgba(102, 126, 234, 0.05);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    `}
  }

  .date {
    font-size: 1.1rem;
  }

  .indicator {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${(p) => (p.selected ? "rgba(255, 255, 255, 0.7)" : "#667eea")};
    margin-top: 4px;
    opacity: ${(p) => (p.isToday || p.selected ? 1 : 0)};
  }
`;

const Footer = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;

  button {
    padding: 0.9rem 1.5rem;
    border-radius: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const CancelButton = styled.button`
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #64748b;

  &:hover {
    background: #f8fafc;
    color: #475569;
  }
`;

const ConfirmButton = styled.button`
  background: ${(p) =>
    p.disabled
      ? "linear-gradient(135deg, #cbd5e1, #94a3b8)"
      : "linear-gradient(135deg, #667eea, #764ba2)"};
  color: white;
  border: none;
  box-shadow: ${(p) => !p.disabled && "0 4px 16px rgba(102, 126, 234, 0.3)"};

  &:hover {
    ${(p) =>
      !p.disabled &&
      `
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    `}
  }

  &:active {
    transform: translateY(0);
  }
`;

const SelectedDateDisplay = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.1);

  .label {
    font-weight: 600;
    color: #64748b;
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
  }

  .date {
    font-weight: 800;
    color: #1e293b;
    font-size: 1.1rem;
  }
`;

function monthTitle(d) {
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

function toDateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function firstDayOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function formatSelectedDate(dateKey) {
  if (!dateKey) return "";
  const [year, month, day] = dateKey.split("-");
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AvailabilityCalendarModal({
  open,
  disabledDateKeys,
  onClose,
  onConfirm,
}) {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const [viewDate, setViewDate] = useState(() => firstDayOfMonth(today));
  const [selectedKey, setSelectedKey] = useState(null);

  const totalDays = daysInMonth(viewDate);
  const startWeekday = firstDayOfMonth(viewDate).getDay(); // 0 Sun - 6 Sat

  const cells = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const isPast = (y, m, d) => {
    const dt = new Date(y, m, d);
    return dt < today;
  };

  const isToday = (y, m, d) => {
    const dt = new Date(y, m, d);
    return toDateKey(dt) === toDateKey(today);
  };
  const handleSelect = (day) => {
    if (!day) return;
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    const key = toDateKey(new Date(y, m, day));

    // Check if date is disabled
    if (disabledDateKeys?.has?.(key) || isPast(y, m, day)) return;

    setSelectedKey(key);
  };

  const goMonth = (dir) => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    const next = new Date(y, m + dir, 1);
    setViewDate(next);
  };

  return (
    <AnimatePresence>
      {open && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Modal
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Header>
              <div className="title">
                <FiCalendar size={20} /> Select a Date
              </div>
              <CloseButton onClick={onClose}>
                <FiX size={18} />
              </CloseButton>
            </Header>

            <Body>
              <CalendarHeader>
                <div className="title">{monthTitle(viewDate)}</div>
                <div className="nav">
                  <button onClick={() => goMonth(-1)}>
                    <FiChevronLeft size={16} />
                  </button>
                  <button onClick={() => goMonth(1)}>
                    <FiChevronRight size={16} />
                  </button>
                </div>
              </CalendarHeader>

              <WeekDays>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </WeekDays>

              <Grid>
                {cells.map((day, idx) => {
                  if (!day) return <div key={`sp-${idx}`} />;

                  const y = viewDate.getFullYear();
                  const m = viewDate.getMonth();
                  const key = toDateKey(new Date(y, m, day));

                  const disabled =
                    disabledDateKeys?.has?.(key) || isPast(y, m, day);
                  const selected = selectedKey === key;
                  const todayFlag = isToday(y, m, day);

                  return (
                    <DayCell
                      key={key}
                      disabled={disabled}
                      selected={selected}
                      isToday={todayFlag}
                      onClick={() => handleSelect(day)}
                      whileHover={!disabled && !selected ? { scale: 1.05 } : {}}
                      whileTap={!disabled && !selected ? { scale: 0.95 } : {}}
                    >
                      <span className="date">{day}</span>
                      <div className="indicator" />
                    </DayCell>
                  );
                })}
              </Grid>

              {selectedKey && (
                <SelectedDateDisplay>
                  <div className="label">Selected Date:</div>
                  <div className="date">{formatSelectedDate(selectedKey)}</div>
                </SelectedDateDisplay>
              )}
            </Body>

            <Footer>
              <CancelButton onClick={onClose}>Cancel</CancelButton>
              <ConfirmButton
                disabled={!selectedKey}
                onClick={() => selectedKey && onConfirm(selectedKey)}
              >
                <FiCheck size={16} />
                Confirm Date
              </ConfirmButton>
            </Footer>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
