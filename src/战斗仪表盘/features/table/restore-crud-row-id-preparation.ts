/**
 * restore-crud-row-id-preparation.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
type CrudRowIdPreparation = Record<string, any>;

export function createRestoreCrudRowIdPreparation(_deps: any) {
  const restoreCrudRowIdPreparation = (preparation: CrudRowIdPreparation): void => {
    preparation?.patchedRows.forEach((patch: any) => {
      patch.row[0] = patch.originalValue;
    });
  };
  return restoreCrudRowIdPreparation;
}
