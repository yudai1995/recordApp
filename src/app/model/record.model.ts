export interface RecordModel {
  id: number | undefined;
  categoryId: number;
  title: string;
  recordDate: Date;
  lastUpdate: Date | undefined;
}
