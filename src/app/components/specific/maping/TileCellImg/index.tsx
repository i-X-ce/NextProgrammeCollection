// import styles from './style.module.css';

export default function TileCellImg({ cellData }: { cellData: number[] }) {
  if (cellData.length !== 16) {
    return <div>セルデータが不正です</div>;
  }
  
  return <div></div>;
}
