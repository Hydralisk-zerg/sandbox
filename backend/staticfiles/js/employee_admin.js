django.jQuery(document).ready(function() {
    var $ = django.jQuery;
    
    // Функция для обновления списка должностей
    function updatePositions() {
        var departmentSelect = $('#id_employee-0-department');
        var positionSelect = $('#id_employee-0-position');
        
        // Делаем поле должности неактивным по умолчанию
        positionSelect.prop('disabled', true);
        
        departmentSelect.change(function() {
            var departmentId = $(this).val();
            if (departmentId) {
                // Получаем список должностей для выбранного отдела
                $.get('/admin/auth/user/get_positions/', {department: departmentId})
                    .done(function(data) {
                        positionSelect.empty();
                        positionSelect.append($('<option value="">---------</option>'));
                        data.forEach(function(item) {
                            positionSelect.append(
                                $('<option></option>').val(item.id).text(item.name)
                            );
                        });
                        positionSelect.prop('disabled', false);
                    });
            } else {
                positionSelect.empty();
                positionSelect.append($('<option value="">---------</option>'));
                positionSelect.prop('disabled', true);
            }
        });
    }

    updatePositions();
});
