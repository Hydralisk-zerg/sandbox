(function($) {
    $(document).ready(function() {
        var departmentSelect = $('#id_employee-0-department');
        var positionSelect = $('#id_employee-0-position');

        function updatePositions() {
            var departmentId = departmentSelect.val();
            if (departmentId) {
                $.getJSON('/admin/auth/user/get_positions/', {department: departmentId}, function(data) {
                    positionSelect.empty();
                    data.forEach(function(item) {
                        positionSelect.append(
                            $('<option></option>').val(item.id).text(item.name)
                        );
                    });
                });
            }
        }

        departmentSelect.change(updatePositions);
        
        // Если это форма редактирования, вызываем функцию при загрузке страницы
        if (departmentSelect.val()) {
            updatePositions();
        }
    });
})(django.jQuery);
