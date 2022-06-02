function userlogout(event){
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
          'logout successfully.',
          'success'
        ).then(()=>{
          window.location = link
        })
        
      }   else {
          return false;
        }
    })
  }

  function deleteblog(event){
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
          'Blog has been deleted successfully.',
          'success'
        ).then(()=>{
          window.location = link
        })
        
      }   else {
          return false;
        }
    })
  }
