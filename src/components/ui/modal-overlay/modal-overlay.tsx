import { FC } from 'react';
import styles from './modal-overlay.module.css';

type TModalOverlayUIProps = {
  onClick: () => void;
};

export const ModalOverlayUI: FC<TModalOverlayUIProps> = ({ onClick }) => (
  <div
    data-testid='modal-overlay'
    className={styles.overlay}
    onClick={onClick}
  />
);
