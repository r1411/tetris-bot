% Фигура "Палка"
shape_matrix(shape_I_rot1, [
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
]).
shape_matrix(shape_I_rot2, [
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0],
    [1,0,0,0]
]).

% Фигура "Квадрат"
shape_matrix(shape_O_rot1, [
    [1,1,0,0],
    [1,1,0,0],
    [0,0,0,0],
    [0,0,0,0]
]).

% Фигура "Буква J"
shape_matrix(shape_J_rot1, [
    [1,1,1,0],
    [0,0,1,0],
    [0,0,0,0],
    [0,0,0,0]
]).
shape_matrix(shape_J_rot2, [
    [0,1,0,0],
    [0,1,0,0],
    [1,1,0,0],
    [0,0,0,0]
]).
shape_matrix(shape_J_rot3, [
    [1,0,0,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
]).
shape_matrix(shape_J_rot4, [
    [1,1,0,0],
    [1,0,0,0],
    [1,0,0,0],
    [0,0,0,0]
]).

% Фигура "Буква L"
shape_matrix(shape_L_rot1, [
    [1,1,1,0],
    [1,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
]).
shape_matrix(shape_L_rot2, [
    [1,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,0,0,0]
]).
shape_matrix(shape_L_rot3, [
    [0,0,1,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
]).
shape_matrix(shape_L_rot4, [
    [1,0,0,0],
    [1,0,0,0],
    [1,1,0,0],
    [0,0,0,0]
]).

% Фигура "Буква S"
shape_matrix(shape_S_rot1, [
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0],
    [0,0,0,0]
]).
shape_matrix(shape_S_rot2, [
    [1,0,0,0],
    [1,1,0,0],
    [0,1,0,0],
    [0,0,0,0]
]).

% Фигура "Буква Z"
shape_matrix(shape_Z_rot1, [
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
]).
shape_matrix(shape_Z_rot2, [
    [0,1,0,0],
    [1,1,0,0],
    [1,0,0,0],
    [0,0,0,0]
]).

% Фигура "Буква T"
shape_matrix(shape_T_rot1, [
    [1,1,1,0],
    [0,1,0,0],
    [0,0,0,0],
    [0,0,0,0]
]).
shape_matrix(shape_T_rot2, [
    [0,1,0,0],
    [1,1,0,0],
    [0,1,0,0],
    [0,0,0,0]
]).
shape_matrix(shape_T_rot3, [
    [0,1,0,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
]).
shape_matrix(shape_T_rot4, [
    [1,0,0,0],
    [1,1,0,0],
    [1,0,0,0],
    [0,0,0,0]
]).

shape_variant(shape_I, shape_I_rot1).
shape_variant(shape_I, shape_I_rot2).

shape_variant(shape_O, shape_O_rot1).

shape_variant(shape_J, shape_J_rot1).
shape_variant(shape_J, shape_J_rot2).
shape_variant(shape_J, shape_J_rot3).
shape_variant(shape_J, shape_J_rot4).

shape_variant(shape_L, shape_L_rot1).
shape_variant(shape_L, shape_L_rot2).
shape_variant(shape_L, shape_L_rot3).
shape_variant(shape_L, shape_L_rot4).

shape_variant(shape_S, shape_S_rot1).
shape_variant(shape_S, shape_S_rot2).

shape_variant(shape_Z, shape_Z_rot1).
shape_variant(shape_Z, shape_Z_rot2).

shape_variant(shape_T, shape_T_rot1).
shape_variant(shape_T, shape_T_rot2).
shape_variant(shape_T, shape_T_rot3).
shape_variant(shape_T, shape_T_rot4).

shapes(shape_I).
shapes(shape_O).
shapes(shape_J).
shapes(shape_L).
shapes(shape_S).
shapes(shape_Z).
shapes(shape_T).

% Функции

% Вывести построчно матрицу
print_matrix([]).
print_matrix([H|T]) :- write(H), nl, print_matrix(T).

% Вывести построчно список матриц
print_matrix_list([]).
print_matrix_list([H|T]) :- print_matrix(H), nl, print_matrix_list(T).

% Получить список всех ротаций фигуры по её имени.
% ShapeName - Входной параметр "Имя фигуры" (shape_БУКВА)
% Rotations - Выходной параметр - Список всех ротаций фигуры в виде матриц
get_rotations(ShapeName, Rotations) :- findall(Matrix, (shape_variant(ShapeName, Variant), shape_matrix(Variant, Matrix)), Rotations), !.

% Вывести на экран красиво все ротации фигуры (для демонстрации get_rotations)
write_rotations(ShapeName) :- get_rotations(ShapeName, Rotations), print_matrix_list(Rotations), !.
