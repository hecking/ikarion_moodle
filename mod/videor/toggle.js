$('#id_resource_type').change(function() {
     $("#id_resource_type option:selected").each(function () {
        if($(this).val() == 2){
            $('#myfile2').attr("disabled", false);
            $('#filebutton').attr("disabled", false);
        }else{
            $('#myfile2').attr("disabled", true);
            $('#filebutton').attr("disabled", true);

        }
    });
});