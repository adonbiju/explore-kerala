
//admin
function blockuser(event){
    event.preventDefault();
    var link = event.currentTarget.href;
    Swal.fire({
      title: 'Block User',
      text: 'User has been blocked successfully',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then(()=>{
      window.location = link
    })
}

function unblockuser(event){
  event.preventDefault();
  var link = event.currentTarget.href;
  Swal.fire({
    title: 'Unblock User',
    text: 'User has been unblocked successfully',
    icon: 'success',
    confirmButtonText: 'Ok'
  }).then(()=>{
    window.location = link
  })
}

function deleteuser(event){
  event.preventDefault();
  var link = event.currentTarget.href;
  Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'This user has been deleted successfully.',
          'success'
        ).then(()=>{
          window.location = link
        })
        
      }   else {
          return false;
        }
    })
}
function adminlogout(event){
  event.preventDefault();
  var link = event.currentTarget.href;
  Swal.fire({
    title: 'Are you sure?',
    text: "Are you going to logout?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'logout!',
        'you logout successfully.',
        'success'
      ).then(()=>{
        window.location = link
      })
      
    }   else {
        return false;
      }
  })
}



function deletecategory(event){
  event.preventDefault();
  var link = event.currentTarget.href;
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Deleted!',
        'This Category has been deleted successfully.',
        'success'
      ).then(()=>{
        window.location = link
      })
      
    }   else {
        return false;
      }
  })
}