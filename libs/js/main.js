
let data = [];
let departmentdb = [];
let locationdb =[];
let signedIn = false;
let updatinglocdep =false;
let creatingEmployee=false;
let updatingEmployee= false;
let deletingEmployee =false;
let idToChange='';

function main(){
getDepartments();
getLocations();
getEmployees();
};

// on click functionalities
$('#search').change(function() {
  getEmployeeByName();
});

$('#departmentsel').change(function(){
  filterEmployeesByDepartment();
})

$('#locationsel').change(function(){
  filterEmployeesByLocation();
}) 

$('#reset').click(
    function(){
    getEmployees();
    $('#departmentsel').val('placeholder'); 
    $('#locationsel').val('placeholder'); 
    $('#search').val('');
    }
);

$('#addLocDep').click(
  function(){
    if(signedIn){
      $('#locDepSel').toggle();
    } else {
      updatinglocdep =true;
      $('#validatePassword').modal('toggle');
    }
  }
)

$('#addEmployeebtn').click(
  function(){
    if(signedIn){
      $("#newFirstName").val('');
      $("#newLastName").val('');
      $("#newJobTitle").val('')
      $("#newEmail").val('');
      $('#addEmployeeModal').modal('toggle');
    } else {
      creatingEmployee=true;
      $('#validatePassword').modal('toggle');
    }
  }
)

$('#passwordbtn').click(
  function(){
    if ($('#username').val()== 'admin' && $('#password').val()== 'password'){
      signedIn = true;
      $('#validatePassword').modal("hide");
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      if(updatinglocdep){
        $('#locDepSel').toggle();
        updatinglocdep =false;
      } else if (creatingEmployee) {
        $("#addEmployeeModal").modal('toggle');
        creatingEmployee =false;
      } else if(updatingEmployee){
        $('#editEmployeeModal').modal('toggle');
        updatingEmployee=false;
      } else if(deletingEmployee){
        $('#deleteEmployeeModal').modal('toggle');
        updatingEmployee=false;
      }
    } else {
      showErrorModal('Wrong username or password')
    }  
  }
) 

$('#saveLoc').click(
  function(){
    function alreadyRegistered(){
      let exist; 
      for (let i=0; i<locationdb.length; i++){
        if (locationdb[i].name == $('#newLoc').val()){
         exist=true;
         break;
        } else {
          exist=false;
        }
        }
        return exist
      }
    let registered = alreadyRegistered();
    let length = checkLength($('#newLoc').val());
    let incorrectCharacters= validateInput($('#newLoc').val())
    if(registered){
      showErrorModal('This location exists already.')
    } else if (!length){
      showErrorModal("Valid Input for new location is between 2 and 50 characters."); 
    } else if (incorrectCharacters){
      showErrorModal('Invalid characters. Please only use letters and white spaces.'); 
    }
    else {
      addNewLocation();
      $('#addLocModal').modal('hide');
      $('#newLoc').val('');
    }
  }
);

$('#saveDep').click(
  function(){
    function alreadyRegistered(){
      let exist; 
      for (let i=0; i<departmentdb.length; i++){
        if (departmentdb[i].name == $('#newDep').val()){
         exist=true;
         break;
        } else {
          exist=false;
        }
        }
        return exist
      }
    let registered = alreadyRegistered();
    let lengthChecked = checkLength($('#newDep').val());
    let incorrectCharacters= validateInput($('#newDep').val());
    if(registered){
      showErrorModal ('This department exists already.');
    } else if(!lengthChecked) {
      showErrorModal("Valid Input for new department is between 2 and 50 characters."); 
    } else if(incorrectCharacters) {
      showErrorModal('Invalid characters. Please only use letters and white spaces.'); 
    }else if (!$('#locDepSelect').val()){
      showErrorModal('Choose a location.');
    } else {
      addNewDepartment();
      $('#addDepModal').modal('hide');
      $('#newDep').val('');
    }
  }
);

$('#saveEmployee').click(
  function(){
      let email = $('#newEmail').val()
      let fName = $('#newFirstName').val();
      let lName = $('#newLastName').val();
      let job = $('#newJob').val();
      function alreadyRegistered(){
        let exist; 
        for (let i=0; i<data.length; i++){
          if ((data[i].firstName == fName && data[i].lastName == lName)||data[i].email == email){
           exist=true;
           break;
          } else {
            exist=false;
          }
          }
          return exist
        }
      let registered = alreadyRegistered();
      let valid = validateEmployeeEntry('employeeDepSelect', email, fName, lName, job);
      if(registered){
        showErrorModal('An employee with these details is already registered in the database.');
      } else if (valid){
        addNewEmployee();
        $('#addEmployeeModal').modal('hide')
      }
      }     
);


$('#deleteDepBtn').click(
   function(){
     checkDeleteDep($('#deleteDepSel').val())
     .then((dependent) => {
       if (dependent){
        showErrorModal('Employee entries dependent on this deparment. Deletion not possible.')
      } else {
      deleteDepartment();
      $('#deleteDepModal').modal('hide');
      }
     })
     .catch((error)=> {
      console.log(error)
     })
}
);

$('#deleteLocBtn').click(
  function(){
  checkDeleteLoc($('#deleteLocSel').val())
  .then((dependent)=>{
    if (dependent){
    showErrorModal('Department entries dependent on this location. Deletion not possible.')
  } else {
   deleteLocation();
   $('#deleteLocModal').modal('hide');
  }
})
  
}
);

// populating dropdown menue

function getDropdowns(htmlID, db, placeholder){
  htmlID.html('');
  let selectph = `<option disabled hidden selected value="placeholder">${placeholder}</option>`;
  htmlID.append(selectph);
  for(let i= 0; i<db.length; i++){
    htmlID.append($("<option>", {
                value: db[i].id,
                text: db[i].name
            })); 
          } 
}

//delete Employees

function deleteEmployeeClick(id){
  $('#delete'+id+'btn').click(
    function(){
    if(signedIn){
      confirmDeleteEmployee(id);
    } else {
      deletingEmployee =true;
      idToChange=id
      $('#validatePassword').modal('toggle');
    }
    }
  );
} 

function confirmDeleteEmployee(id){
  $('#deleteEmployeeConfirmBtn').click(
  function(){
    deleteEmployee(id);
    $('#deleteEmployeeModal').modal('hide');

  }
)
}

// updateEmployees

function updateEmployeeClick(id){
  $('#edit'+id+'btn').click(
    function(){
    appendUpdateForm(id);
    confirmUpdateEmployee(id);
    if(signedIn){
      $('#editEmployeeModal').modal('toggle');
    } else {
      updatingEmployeee=true;
      $('#validatePassword').modal('toggle');
    }
    }
  );
} 

function confirmUpdateEmployee(id){
  $('#updateEmployeeConfirmBtn').click(
  function(){
      let email = $('#Email').val()
      let fName = $('#FirstName').val();
      let lName = $('#LastName').val();
      let job = $('#Job').val();
      let valid = validateEmployeeEntry('updateDepSelect', email, fName, lName, job);
      if (valid){
        updateEmployee(id);
        $('#editEmployeeModal').modal('hide')
      }
  }
)
}

//receiving data from database

function getDepartments() { 
    $.ajax({
      url: "libs/php/getAllDepartments.php",
      type: 'GET',
      dataType: 'json', 
      success: function(result) {
            console.log(result);
          departmentdb = result.data;
          let placeholder='Select Department'
          getDropdowns($('#departmentsel'), departmentdb, placeholder);
          getDropdowns($('#employeeDepSelect'), departmentdb, placeholder);
          getDropdowns($('#deleteDepSel'), departmentdb, placeholder);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR + textStatus+ errorThrown );
      }
    }); 
    
  }

  function getLocations()  {
    $.ajax({
      url: "libs/php/getAllLocations.php",
      type: 'GET',
      dataType: 'json', 
      success: function(result) {
            console.log(result);
            locationdb= result.data
            let placeholder = 'Select Location'
            getDropdowns($('#locationsel'), locationdb, placeholder);
            getDropdowns($('#locDepSelect'), locationdb, placeholder);
            getDropdowns($('#deleteLocSel'), locationdb, placeholder);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR + textStatus+ errorThrown )
      }
    });   
  }

  function getEmployeeByName(){
   $.ajax({
     url: "libs/php/getEmployeeByName.php",
     type: 'POST',
     dataType: 'json', 
     data:{
       firstName : $('#search').val(),
       lastName: $('#search').val()
     },
     success: function(result) {
          $('#dataBody').html('');
          let employeeMatch = result.data;
           for (let j=0; j<employeeMatch.length; j++){
             for(let i=0; i<data.length; i++){
             if (data[i].firstName == employeeMatch[j].firstName || data[i].lastName == employeeMatch[j].lastName){
             let id= data[i].id;
             let firstName = data[i].firstName;
             let lastName= data[i].lastName;
             let email = data[i].email;
             let department = data[i].department;
             let job = data[i].jobTitle;
             let location = data[i].location;
             let employeeCard =createEmployeeCard(id, firstName, lastName, email, department, job, location);
             $('#dataBody').append(employeeCard);
             deleteEmployeeClick(id);
             updateEmployeeClick(id);
             }
             }
           }
     },
     error: function(jqXHR, textStatus, errorThrown) {
       console.log(jqXHR + textStatus+ errorThrown )
     }
   }); 
  
  }

 function getEmployees(){
  $.ajax({
    url: "libs/php/getAll.php",
    type: 'GET',
    dataType: 'json', 
    success: function(result) {
         $('#dataBody').html('');
          console.log(result);
           data = result.data;
          for (let i= 0; i< data.length; i++){
            let id = data[i].id;  
            let firstName = data[i].firstName;
            let lastName= data[i].lastName;
            let email = data[i].email;
            let department = data[i].department;
            let job = data[i].jobTitle;
            let location = data[i].location;
            let employeeCard =createEmployeeCard(id, firstName, lastName, email, department,job, location);
            $('#dataBody').append(employeeCard)
            deleteEmployeeClick(id);
            updateEmployeeClick(id);
          }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR + textStatus+ errorThrown )
    }
  }); 
 }

 function createEmployeeCard(id, firstName, lastName, email, department, job, location){  
  let infoCard = `<div class="card" id="${id}">
  <div class="card-header justify-content-center">
  <h5>${firstName} ${lastName}</h5>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">${email}</li>
    <li class="list-group-item">${department} &nbsp &nbsp${job}</li>
    <li class="list-group-item">${location}</li>
  </ul>
  <button class="changeBtn btn" data-toggle="modal" role="button" aria-expanded="false" aria-controls="editEmployee" id="edit${id}btn" value="${id}">edit</button>
  <button class="changeBtn btn" data-toggle="modal" href="#deleteEmployeeModal" role="button" aria-expanded="false" aria-controls="deleteEmployee" id="delete${id}btn" value="${id}">delete</button>
</div>`;
return infoCard
 };

 // updating employee

 function appendUpdateForm(id){
  $('#editEmployeeModal').html('');
  for (let i= 0; i< data.length; i++){
    let employeeID = data[i].id;
    if (employeeID == id){
    let firstName = data[i].firstName;
    let lastName= data[i].lastName;
    let job = data[i].jobTitle;
    let email = data[i].email;
    let department = data[i].department;
    let updateForm = createUpdateForm(firstName, lastName, job, email);
    $('#editEmployeeModal').append(updateForm);
    getDropdowns($('#updateDepSelect'), departmentdb);
    for(let i=0; i<departmentdb.length; i++){
      if(department == departmentdb[i].name){
        $("#updateDepSelect").val(departmentdb[i].id);
        break; 
      } 
    }
    }
  }
}

  function createUpdateForm(fName, lName, job, mail){
   let form = `
   <div class="modal-dialog" role="document">
     <div class="modal-content">
       <div class="modal-header">
         <h6 class="modal-title">Update Employee</h6>
         <button type="button" class="close" data-dismiss="modal" aria-label="Close">
           <span aria-hidden="true">&times;</span>
         </button>
       </div>
       <div class="modal-body">
           <form>
               <div class="form-group">
                 <label for="FirstName">First Name</label>
                 <input class="form-control" id="FirstName" value="${fName}"></input>
               </div>
               <div class="form-group">
                   <label for="LastName">Last Name</label>
                   <input class="form-control" id="LastName" value="${lName}"></input>
                 </div>
                 <div class="form-group">
                   <label for="JobTitle">Job Title</label>
                   <input class="form-control" id="JobTitle" value="${job}"></input>
                 </div>
                 <div class="form-group">
                   <label for="Email">Email</label>
                   <input class="form-control" id="Email" value="${mail}"></input>
                 </div>
               <div class="form-group">
                   <label for="updateDepSelect">Department</label>
                   <select class="form-control" id="updateDepSelect">
                   </select>
                 </div>
             </form>
       </div>
       <div class="modal-footer">
         <button class="btn btn-secondary" data-dismiss="modal">Cancel</button>
         <button class="confirmBtn btn" id='updateEmployeeConfirmBtn'>Save</button>
       </div>
     </div>
   </div>` 
 return form;
}

 // filter database
 
 function filterEmployeesByDepartment(){
          $('#dataBody').html('');
          let location ='';
          for (let i= 0; i< data.length; i++){
            let department = data[i].department;
            if (department ==$('#departmentsel option:selected').text()){
            let id = data[i].id;
            let firstName = data[i].firstName;
            let lastName= data[i].lastName;
            let email = data[i].email;
            let job = data[i].jobTitle;
            location = data[i].location;
            let employeeCard = createEmployeeCard(id, firstName, lastName, email, department, job, location);
            $('#dataBody').append(employeeCard)
            deleteEmployeeClick(id);
            updateEmployeeClick(id);
            }
            }
          for (let j=0; j<locationdb.length; j++) {
            if (location == locationdb[j].name){
              let locationID = locationdb[j].id
              $('#locationsel').val(locationID); 
            }
          }
 }

 function filterEmployeesByLocation(){
          $('#dataBody').html('');
          for (let i= 0; i< data.length; i++){
            let location = data[i].location;
            if (location ==$('#locationsel option:selected').text()){
            let id = data[i].id;
            let firstName = data[i].firstName;
            let lastName= data[i].lastName;
            let email = data[i].email;
            let department = data[i].department;
            let job = data[i].jobTitle;
            let employeeCard = createEmployeeCard(id, firstName, lastName, email, department, job, location);
            $('#dataBody').append(employeeCard)
            deleteEmployeeClick(id);
            updateEmployeeClick(id);
            }
          }
 }

 //updating database

 function addNewLocation() {
  $.ajax({
    url: "libs/php/insertLocation.php",
    type: 'POST',
    dataType: 'json', 
    data:{
      name : $('#newLoc').val(),
    },
    success: function(result) {
         console.log(result);
         getLocations();
         $('#newLoc').val('');
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR + textStatus+ errorThrown )
    }
  }); 
 }

 function addNewDepartment() {
 $.ajax({
   url: "libs/php/insertDepartment.php",
   type: 'POST',
   dataType: 'json', 
   data:{
     name : $('#newDep').val(),
     locationID: $('#locDepSelect').val()
   },
   success: function(result) {
        console.log(result);
        getDepartments();
        $('#newDep').val('');
        $('#locDepSelect').val('placeholder');
   },
   error: function(jqXHR, textStatus, errorThrown) {
     console.log(jqXHR + textStatus+ errorThrown )
   }
 });  
}

function addNewEmployee() {
 $.ajax({
   url: "libs/php/insertEmployee.php",
   type: 'POST',
   dataType: 'json', 
   data:{
     firstName : $('#newFirstName').val(),
     lastName: $('#newLastName').val(),
     jobTitle: $('#newJobTitle').val(),
     email: $('#newEmail').val(),
     departmentID: $('#employeeDepSelect').val()
   },
   success: function(result) {
        console.log(result);
        getEmployees();
   },
   error: function(jqXHR, textStatus, errorThrown) {
     console.log(jqXHR + textStatus+ errorThrown )
   }
 });  
}

function deleteDepartment() {
 $.ajax({
   url: "libs/php/deleteDepartmentByID.php",
   type: 'POST',
   dataType: 'json', 
   data:{
     id: $('#deleteDepSel').val()
   },
   success: function(result) {
        console.log(result);
        getDepartments();
        
   },
   error: function(jqXHR, textStatus, errorThrown) {
     console.log(jqXHR + textStatus+ errorThrown )
   }
 });  
}

function deleteLocation() {
 $.ajax({
   url: "libs/php/deleteLocation.php",
   type: 'POST',
   dataType: 'json', 
   data:{
     id: $('#deleteLocSel').val()
   },
   success: function(result) {
        console.log(result);
        getLocations();
   },
   error: function(jqXHR, textStatus, errorThrown) {
     console.log(jqXHR + textStatus+ errorThrown )
   }
 });  
}

function deleteEmployee(id) {
  console.log(id);
  $.ajax({
   url: "libs/php/deleteEmployee.php",
   type: 'POST',
   dataType: 'json', 
   data:{
     id: id
   },
   success: function(result) {
        console.log(result);
        getEmployees();
   },
   error: function(jqXHR, textStatus, errorThrown) {
     console.log(jqXHR + textStatus+ errorThrown )
   }
 }); 
}

function updateEmployee(id) {
  $.ajax({
   url: "libs/php/updateEmployee.php",
   type: 'POST',
   dataType: 'json', 
   data:{
     id: id,
     firstName : $('#FirstName').val(),
     lastName: $('#LastName').val(),
     jobTitle: $('#JobTitle').val(),
     email: $('#Email').val(),
     departmentID: $('#updateDepSelect').val()
   },
   success: function(result) {
        console.log(result);
        getEmployees();
        $('#FirstName').val(''),
        $('#LastName').val(''),
        $('#JobTitle').val(''),
        $('#Email').val(''),
        $('#updateDepSelect').val('')
   },
   error: function(jqXHR, textStatus, errorThrown) {
     console.log(jqXHR + textStatus+ errorThrown )
   }
 });
}

// validation functions

function validatePassword(){
  if ($('#username').val()== 'admin' && $('#password').val()== 'password'){
    signedIn = true;
    $('#locDepSel').toggle();
    $('#validatePassword').modal("hide");
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  } else {
    alert('Incorrect user name or password')
  }
}

function validateEmail(email) {
	const reexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (reexp.test(email) == false){
    return false
	} else {
    return true
  }
}

function validateInput(input){
  var reg= /^[a-zA-Z\. ]*$/
if(reg.test(input)){              
return false;
}               
return true;
}

function checkLength(input){
  if (input.length < 2 || input.length > 50){
    return false;
  } else {
  return true;
  }
}

function validateEmployeeEntry(selectMenue, email, fName, lName, job){
  
  let validatedEmail =validateEmail(email);
  let incorrectFirstName = validateInput(fName);
  let incorrectLastName = validateInput(lName)
  let incorrectJob = validateInput(job);
  let lengthFirstName = checkLength(fName);
  let lengthLastName = checkLength(lName);
  if (!validatedEmail){
    showErrorModal('Please enter a valid email address.')
  } else if(!$(`#${selectMenue}`).val()){
     showErrorModal('Choose a department.');
     //$(`#${modal}`).modal('toggle');
     //alert('Choose a department.')
   } else if(incorrectFirstName|| incorrectLastName|| incorrectJob){
     showErrorModal('Invalid characters. Please only use letters and white spaces.');
   } else if(!lengthFirstName || !lengthLastName){
     showErrorModal('Valid input for names between 2 and 50 characters.');
   } else {
       return true;
     }
}

//check for dependent entries

function checkDeleteDep(depID){
  return new Promise((resolve, reject) => {
  $.ajax({
    url: "libs/php/getDepartmentByID.php",
    type: 'POST',
    dataType: 'json', 
    data:{
      departmentID : depID
    },
    success: function(result) {
        let dependencies;
        let count = result.data[0]['count(id)']
        if (count >0){
          dependencies = true;
        } else {
          dependencies = false
        }
        resolve(dependencies);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR + textStatus+ errorThrown )
      reject(error)
    }
  }); 
})
}

function checkDeleteLoc(locID){
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "libs/php/getLocationByID.php",
      type: 'POST',
      dataType: 'json', 
      data:{
        locationID : locID
      },
      success: function(result) {
        console.log(result);
          let dependencies;
          let count = result.data[0]['count(id)']
          if (count >0){
            dependencies = true;
          } else {
            dependencies = false
          }
          resolve(dependencies);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR + textStatus+ errorThrown )
        reject(error)
      }
    }); 
  })
}

//Error display
function showErrorModal(errortext){
$('#errorFooter').html('');
let button =`<button class="confirmBtn btn" data-dismiss="modal" role="button" aria-expanded="false" aria-controls="error"  id='notificationBtn'>Ok</button>`
$('#errorBody').html(errortext);
$('#errorFooter').append(button);
$('#errorModal').modal('show');
}

$(document).ready(() => {
  main();
});



 




 