export function IsProjectNameValid(ProjectName){
    const expression = /^([a-z\-\_\d])+$/;
    return expression.test(ProjectName);
}
