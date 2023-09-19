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

% Перебрать все числа в диапазоне от Low до High (включительно)
range(Low, Low, _).
range(Out,Low,High) :- NewLow is Low+1, NewLow =< High, range(Out, NewLow, High).

% Генерация списка с одинаковыми элементами
% X - Элемент
% N - Длина списка
% List - Выходной аргумент, итоговый список.
same_numbers_list(X, N, List)  :- 
    length(List, N), 
    maplist(=(X), List).

% Склеить два списка (первые две перменные - два списка, третья - результат)
join([], X, X).
join([X|Y], Z, [X|W]) :- join(Y, Z, W).

% Сложение матриц (первые две переменные - входные матрицы, третья - результат)
matrix_add(M1, M2, M3) :- maplist(maplist(sum), M1, M2, M3).
sum(X,Y,Z) :- Z is X+Y.

% Отзеркалить список
reverse([],Z,Z).
reverse([H|T],Z,Acc) :- reverse(T,Z,[H|Acc]).
reverse(In, Out) :- reverse(In, Out, []).

% Количество вхождений элемента в список
count([],_,0).
count([X|T],X,Y):- count(T,X,Z), Y is 1+Z.
count([X1|T],X,Z):- X1\=X,count(T,X,Z), !.

% Значение в матрице по индексу [Row, Col]
cell_value(Matrix, Row, Col, Value) :-
    nth0(Row, Matrix, TheRow),
    nth0(Col, TheRow, Value), !.


get_free_cells(_, _, Result, Result, 1) :- !.
get_free_cells(Matrix, _, Result, CurrentIndex, _) :- length(Matrix, RowsCnt), CurrentIndex is (RowsCnt - 1), Result is RowsCnt, !.
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


get_descent_count(_, ShpW, _, _, _, CurrentShapeColumnIdx, Result, Result) :- CurrentShapeColumnIdx is ShpW, !.
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


% Перебрать все валидные столбцы нахождения левого пикселя фигуры для конкретной ее ротации
% ShapeVariant - Вариант ротации фигуры
% FieldWidth - Ширина игрового поля
% Result - Выходная переменная
get_valid_placement_columns(ShapeVariant, FieldWidth, Result) :-
    shape_matrix(ShapeVariant, ShapeMatrix), 
    nth0(0, ShapeMatrix, ShapeFirstRow), 
    length(ShapeFirstRow, ShapeWidth),
    FreeSpace is FieldWidth - ShapeWidth,
    range(Result, 0, FreeSpace).


widen_shape_matrix([], _, _, Result, _, Result) :- !. 
widen_shape_matrix([CurrentShapeRow|NextShapeRows], Column, FieldWidth, Result, ShapeWidth, CurrentResult) :-
    SuffixCount is FieldWidth - Column - ShapeWidth,
    same_numbers_list(0, Column, PrefixList),
    same_numbers_list(0, SuffixCount, SuffixList),
    join(PrefixList, CurrentShapeRow, Temp1),
    join(Temp1, SuffixList, ResRow),
    join(CurrentResult, [ResRow], NewCurRes),
    widen_shape_matrix(NextShapeRows, Column, FieldWidth, Result, ShapeWidth, NewCurRes), !.
% Дополнить матрицу фигуры нулями слева и справа до ширины поля
% ShapeMatrix - Матрица фигуры
% Column - Столбец поля, в котором стоит левый край фигуры
% FieldWidth - Ширина поля
% Result - Выходная переменная, дополненная матрица
widen_shape_matrix(ShapeMatrix, Column, FieldWidth, Result) :-
    nth0(0, ShapeMatrix, ShapeFirstRow),
    length(ShapeFirstRow, ShapeWidth),
    widen_shape_matrix(ShapeMatrix, Column, FieldWidth, Result, ShapeWidth, []), !. 


% Вернуть матрицу пустого игрового поля с фигурой на нужном месте
% ShapeMatrix - Матрица фигуры
% FieldWidth - Ширина игрового поля
% FieldHeight - Высота игрового поля
% ShapeCol - Столбец поля, в котором стоит левый край фигуры
% Descent - На сколько пикселей вниз опущена фигура
% Result - Выходная переменная, результат
shape_on_field_matrix(ShapeMatrix, FieldWidth, FieldHeight, ShapeCol, Descent, Result) :-
    length(ShapeMatrix, ShapeHeight),
    BottomRowsCnt is FieldHeight - Descent - ShapeHeight,
    same_numbers_list(0, FieldWidth, ZerosRow),
    I = ZerosRow, N = Descent, findall(I, between(1,N,_), TopPart),
    widen_shape_matrix(ShapeMatrix, ShapeCol, FieldWidth, MidPart),
    I1 = ZerosRow, N1 = BottomRowsCnt, findall(I1, between(1,N1,_), BottomPart),
    join(TopPart, MidPart, Temp1),
    join(Temp1, BottomPart, Result).


% Установить фигуру на игровое поле
% FieldMatrix - Матрица игрового поля
% FieldWidth - Ширина игрового поля
% FieldHeight - Высота игрового поля
% ShapeVariant - Вариант ротации фигуры,
% Column - Столбец поля, в котором стоит левый край фигуры
% ResultField - Выходная переменная, результирующее игровое поле
place_shape(FieldMatrix, FieldWidth, FieldHeight, ShapeVariant, Column, ResultField) :-
    shape_matrix(ShapeVariant, ShapeMatrix),
    get_descent_count(FieldMatrix, ShapeVariant, Column, DescentCount),
    shape_on_field_matrix(ShapeMatrix, FieldWidth, FieldHeight, Column, DescentCount, AddingMatrix),
    matrix_add(FieldMatrix, AddingMatrix, ResultField).


% Максимальная высота накопившихся на поле блоков
% FieldMatrix - Матрица игрового поля
% FieldWidth - Ширина игрового поля
% FieldHeight - Высота игрового поля
% Result - Выходная переменная, максимальная высота блоков на поле.
garbage_height(FieldMatrix, FieldWidth, FieldHeight, Result) :-
    same_numbers_list(0, FieldWidth, EmptyRow),
    reverse(FieldMatrix, UpsideDownFieldMatrix),
    (nth0(Result, UpsideDownFieldMatrix, EmptyRow); Result is FieldHeight), !.


% Количество собранных линий на поле
% FieldMatrix - Матрица игрового поля
% FieldWidth - Ширина игрового поля
% Result - Выходная переменная, количество полных линий
full_lines_count(FieldMatrix, FieldWidth, Result) :-
    same_numbers_list(1, FieldWidth, FullRow),
    count(FieldMatrix, FullRow, Result).


% Является ли ячейка матрицы по индексу [Row, Col] дырой
% FieldMatrix - Матрица игрового поля
% Row - Индекс строки
% Col - Индекс столбца
is_hole(FieldMatrix, Row, Col) :-
    Row2 is Row + 1,
    cell_value(FieldMatrix, Row, Col, ValueTop), ValueTop is 1,
    cell_value(FieldMatrix, Row2, Col, ValueBottom), ValueBottom is 0, !.


% Возвращает true столько раз, сколько дырок на поле
% FieldMatrix - Матрица игрового поля
% FieldWidth - Ширина игрового поля
% FieldHeight - Высота игрового поля
find_hole(FieldMatrix, FieldWidth, FieldHeight) :-
    WidthLimit is FieldWidth - 1, HeightLimit is FieldHeight - 2,
    range(RowIdx, 0, HeightLimit), range(ColIdx, 0, WidthLimit),
    Row is RowIdx, Col is ColIdx,
    is_hole(FieldMatrix, Row, Col).


% Получить количество дырок на игровом поле
% FieldMatrix - Матрица игрового поля
% FieldWidth - Ширина игрового поля
% FieldHeight - Высота игрового поля
% Result - Выходная переменная, количество дырок на поле
count_holes(FieldMatrix, FieldWidth, FieldHeight, Result) :- 
    aggregate_all(count, find_hole(FieldMatrix, FieldWidth, FieldHeight), Result), !.


% Оценить текущее игровое поле относительно изначального
% NewField - Матрица текущего игрового поля
% OldField - Матрица прошлого игрового поля
% FieldWidth - Ширина игрового поля
% FieldHeight - Высота игрового поля
% Score - Выходная переменная, оценка. Чем выше, тем лучше.
field_score(NewField, OldField, FieldWidth, FieldHeight, Score) :-
    count_holes(OldField, FieldWidth, FieldHeight, OldHolesCount),
    count_holes(NewField, FieldWidth, FieldHeight, NewHolesCount),
    garbage_height(OldField, FieldWidth, FieldHeight, OldGarbageHeight),
    garbage_height(NewField, FieldWidth, FieldHeight, NewGarbageHeight),
    full_lines_count(NewField, FieldWidth, NewFullLines),
    FactorHoles is (OldHolesCount - NewHolesCount) * 100,
    FactorGarbage is (OldGarbageHeight  - NewGarbageHeight) * 10,
    FactorFullLines is NewFullLines * 80,
    Score is FactorHoles + FactorGarbage + FactorFullLines.


% Получить все возможные конечные позиции фигуры и их оценку
% FieldMatrix - Матрица игрового поля
% Shape - Тип фигуры
% ResultField - Выходная переменная, результирующее поле
% Score - Выходная переменная, оценка результирующей позиции
% ShapeVariant - Выходная переменная, ротация фигуры
% PlacementColumn - Выходная переменная, столбец, в котором находится левый край фигуры
all_placements(FieldMatrix, Shape, ResultField, Score, ShapeVariant, PlacementColumn) :-
    length(FieldMatrix, FieldHeight),
    nth0(0, FieldMatrix, FieldFirstRow),
    length(FieldFirstRow, FieldWidth),
    shape_variant(Shape, ShapeVariant),
    get_valid_placement_columns(ShapeVariant, FieldWidth, PlacementColumn),
    place_shape(FieldMatrix, FieldWidth, FieldHeight, ShapeVariant, PlacementColumn, ResultField),
    field_score(ResultField, FieldMatrix, FieldWidth, FieldHeight, Score).


% Выбрать лучший вариант поля с наибольшим количеством очков 
% FieldMatrix - Матрица игрового поля
% Shape - Тип фигуры
% MaxResultField - Выходная переменная, результирующее поле
% MaxScore - Выходная переменная, оценка результирующей позиции
% MaxShapeVariant - Выходная переменная, ротация фигуры
% MaxPlacementColumn - Выходная переменная, столбец, в котором находится левый край фигуры
best_placement(FieldMatrix, Shape, MaxResultField, MaxScore, MaxShapeVariant, MaxPlacementColumn) :-
    setof(Score-ResultField-ShapeVariant-PlacementColumn, all_placements(FieldMatrix, Shape, ResultField, Score, ShapeVariant, PlacementColumn), R),
    reverse(R, [MaxScore-MaxResultField-MaxShapeVariant-MaxPlacementColumn|_]), !.

% HTTP Сервер
:- use_module(library(http/http_server)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json_convert)).

:- json_object error_object(error:any).
:- json_object input_object(field_matrix:any, shape:any).
:- json_object placement_object(rotation_variant:any, column:any).
:- json_object response_object(response:any).

:- initialization
    http_server([port(8765)]).

:- http_handler(root(.), home_page, []).
:- http_handler(root(solve), solve_request, [method(post)]).

home_page(_Request) :-
    reply_html_page(
	    title('Tetris bot'),
	    [h1('Bot is running!')]
    ).

solve_request(Request) :-
    http_read_json(Request, JSONIn),
    json_to_prolog(JSONIn, input_object(FieldMatrix, Shape)),
    best_placement(FieldMatrix, Shape, _, _, ResultRotation, ResultColumn),
    prolog_to_json(response_object(placement_object(ResultRotation, ResultColumn)), JSONObject),
    reply_json(JSONObject).
