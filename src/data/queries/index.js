
export const getUnionRates = `query ($input: UnionRatesDataTypeInputArgsType){
unionRatesQuery(input: $input) {
  id,
 UnionCode,
 UnionCodeDesc,
 StartEffectiveDate,
 EndingEffectiveDate,
 JobType,
 JobTypeDesc,
 JobStep,
 JobStepDesc,
 ShiftCode,
 ShiftCodeDesc,
 HourlyRate,
 UpdatedBy,
 InsertedBy,
 UpdatedDaDate,
 InsertedDate
}
}`;

export const createUnionRates = `mutation ($input: UnioRatesDataCreateInput!){
  createUnionRate(input: $input) {
    id,
   UnionCode,
   UnionCodeDesc,
   StartEffectiveDate,
   EndingEffectiveDate,
   JobType,
   JobTypeDesc,
   JobStep,
   JobStepDesc,
   ShiftCode,
   ShiftCodeDesc,
   HourlyRate,
   UpdatedBy,
   InsertedBy,
   UpdatedDaDate,
   InsertedDate
  }
  }`
  export const updateUnionRates = `mutation ($input: UnionRatesDataUpdateInputType!){
    updateUnionRate(input: $input) {
     id,
     UnionCode,
     UnionCodeDesc,
     StartEffectiveDate,
     EndingEffectiveDate,
     JobType,
     JobTypeDesc,
     JobStep,
     JobStepDesc,
     ShiftCode,
     ShiftCodeDesc,
     HourlyRate,
     UpdatedBy,
     InsertedBy,
     UpdatedDaDate,
     InsertedDate
    }
    }`