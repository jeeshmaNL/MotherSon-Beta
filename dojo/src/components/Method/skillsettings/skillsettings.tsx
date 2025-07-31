// import { MonthlySkillEvaluationForm } from "./MonthlySkills";
import OperationsCard from "./OperationsCard";
// import OperatorLevelsComponent from "./OperatorLevelsCard";
import SectionCard from "./SectionCard";
import SkillMatrixCard from "./SkillMatrixCard";

const SkillMatrixForm = () => {
  return (
    <div>
      <SkillMatrixCard />
      <SectionCard />
      <OperationsCard />
      {/* <OperatorLevelsComponent /> */}
      {/* <MonthlySkillEvaluationForm />  */}
    </div>
  );
};

export default SkillMatrixForm;
