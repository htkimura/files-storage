import { FileSortField, SortDirection } from '@common/enums';

export interface FileOrderBy {
  name?: SortDirection;
  createdAt?: SortDirection;
}

export function getFileOrderBy(
  sortBy: FileSortField = FileSortField.DATE,
  sortOrder: SortDirection = SortDirection.DESC,
): FileOrderBy {
  if (sortBy === FileSortField.NAME) {
    return { name: sortOrder };
  }

  return { createdAt: sortOrder };
}
