% Фигура "Палка"
shape_matrix(shape_I_rot1, [
    [1,1,1,1]
]).
shape_matrix(shape_I_rot2, [
    [1],
    [1],
    [1],
    [1]
]).

% Фигура "Квадрат"
shape_matrix(shape_O_rot1, [
    [1,1],
    [1,1]
]).

% Фигура "Буква J"
shape_matrix(shape_J_rot1, [
    [1,1,1],
    [0,0,1]
]).
shape_matrix(shape_J_rot2, [
    [0,1],
    [0,1],
    [1,1]
]).
shape_matrix(shape_J_rot3, [
    [1,0,0],
    [1,1,1]
]).
shape_matrix(shape_J_rot4, [
    [1,1],
    [1,0],
    [1,0]
]).

% Фигура "Буква L"
shape_matrix(shape_L_rot1, [
    [1,1,1],
    [1,0,0]
]).
shape_matrix(shape_L_rot2, [
    [1,1],
    [0,1],
    [0,1]
]).
shape_matrix(shape_L_rot3, [
    [0,0,1],
    [1,1,1]
]).
shape_matrix(shape_L_rot4, [
    [1,0],
    [1,0],
    [1,1]
]).

% Фигура "Буква S"
shape_matrix(shape_S_rot1, [
    [0,1,1],
    [1,1,0]
]).
shape_matrix(shape_S_rot2, [
    [1,0],
    [1,1],
    [0,1]
]).

% Фигура "Буква Z"
shape_matrix(shape_Z_rot1, [
    [1,1,0],
    [0,1,1]
]).
shape_matrix(shape_Z_rot2, [
    [0,1],
    [1,1],
    [1,0]
]).

% Фигура "Буква T"
shape_matrix(shape_T_rot1, [
    [1,1,1],
    [0,1,0]
]).
shape_matrix(shape_T_rot2, [
    [0,1],
    [1,1],
    [0,1]
]).
shape_matrix(shape_T_rot3, [
    [0,1,0],
    [1,1,1]
]).
shape_matrix(shape_T_rot4, [
    [1,0],
    [1,1],
    [1,0]
]).


% Количество отсутствующих клеток снизу в каждом столбце при конкретной ротации фигуры
shape_empty_cells(shape_I_rot1, [0,0,0,0]).
shape_empty_cells(shape_I_rot2, [0]).
shape_empty_cells(shape_O_rot1, [0,0]).
shape_empty_cells(shape_J_rot1, [1,1,0]).
shape_empty_cells(shape_J_rot2, [0,0]).
shape_empty_cells(shape_J_rot3, [0,0,0]).
shape_empty_cells(shape_J_rot4, [0,2]).
shape_empty_cells(shape_L_rot1, [0,1,1]).
shape_empty_cells(shape_L_rot2, [2,0]).
shape_empty_cells(shape_L_rot3, [0,0,0]).
shape_empty_cells(shape_L_rot4, [0,0]).
shape_empty_cells(shape_S_rot1, [0,0,1]).
shape_empty_cells(shape_S_rot2, [1,0]).
shape_empty_cells(shape_Z_rot1, [1,0,0]).
shape_empty_cells(shape_Z_rot2, [0,1]).
shape_empty_cells(shape_T_rot1, [1,0,1]).
shape_empty_cells(shape_T_rot2, [1,0]).
shape_empty_cells(shape_T_rot3, [0,0,0]).
shape_empty_cells(shape_T_rot4, [0,1]).

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


% Днища рекурсии
get_free_cells(_, _, Result, Result, 1) :- !.
get_free_cells(Matrix, _, Result, CurrentIndex, _) :- length(Matrix, RowsCnt), CurrentIndex is (RowsCnt - 1), Result is RowsCnt, !.
% Рекурсия
get_free_cells(Matrix, ColumnIdx, Result, CurrentIndex, _) :- 
    NewCurIdx is CurrentIndex + 1, 
    nth0(NewCurIdx, Matrix, CurrentRow), 
    nth0(ColumnIdx, CurrentRow, NewCurVal),
    get_free_cells(Matrix, ColumnIdx, Result, NewCurIdx, NewCurVal), !.

% Функция для нахождения расстояния от верхней клетки поля до заполненной клетки в заданном столбце
% Matrix - Матрица игрового поля (1 - закрашено, 0 - пусто)
% ColumnIdx - Индекс рассматриваемого столбца
% Result - Выходная переменная 
get_free_cells([FirstRow|Other], ColumnIdx, Result) :- nth0(ColumnIdx, FirstRow, CurrentValue), get_free_cells([FirstRow|Other], ColumnIdx, Result, 0, CurrentValue), !.


% Дно рекурсии
get_descent_count(FieldMatrix, ShpW, ShpH, ShapeEmptyCells, ColumnIdx, CurrentShapeColumnIdx, Result, Result) :- CurrentShapeColumnIdx is (ShpW - 1), !.
get_descent_count(FieldMatrix, ShpW, ShpH, ShapeEmptyCells, ColumnIdx, CurrentShapeColumnIdx, CurrentMinDescent, Result) :-
    ColOffset is ColumnIdx + CurrentShapeColumnIdx,
    get_free_cells(FieldMatrix, ColOffset, FC),
    nth0(CurrentShapeColumnIdx, ShapeEmptyCells, SEC),
    Desc is FC - ShpH + SEC,
    NewMinDescent is min(CurrentMinDescent, Desc),
    NewShpColIdx is CurrentShapeColumnIdx + 1,
    get_descent_count(FieldMatrix, ShpW, ShpH, ShapeEmptyCells, ColumnIdx, NewShpColIdx, NewMinDescent, Result), !.

% Функция для нахождения количества спусков фигуры до контакта, при условии, что
% левый пиксель фигуры находится в столбце ColumnIndex
% FieldMatrix - Матрица игрового поля
% ShapeVariant - Вариант ротации фигуры 
% ColumnIdx - Столбец, где находится самый левый пиксель фигуры
get_descent_count(FieldMatrix, ShapeVariant, ColumnIdx, Result) :- 
    shape_matrix(ShapeVariant, ShapeMatrix), 
    nth0(0, ShapeMatrix, ShapeFirstRow), 
    length(ShapeFirstRow, ShapeWidth),
    length(ShapeMatrix, ShapeHeight),
    shape_empty_cells(ShapeVariant, ShapeEmptyCells),
    get_free_cells(FieldMatrix, ColumnIdx, FC),
    nth0(0, ShapeEmptyCells, SEC),
    FallBackResult is FC - ShapeHeight + SEC,
    get_descent_count(FieldMatrix, ShapeWidth, ShapeHeight, ShapeEmptyCells, ColumnIdx, 0, FallBackResult, Result), !.
