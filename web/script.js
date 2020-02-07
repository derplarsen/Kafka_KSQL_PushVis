if (typeof String.prototype.startsWith != 'function') {
  // startWith checks if the string begins with the string passed in
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

angular.module('SuggestedQuery', [])
.controller('suggestionInputCtrl', ['$scope', function($scope){
  var knownQueries = ["Alison Cassidy", "Catherine Sinu", "Sherry Mckenna", "Wil Jones", "Adrian Delamico", "Elizabeth Wu", "David Liam", "James Weston","Sherry, Elizabeth & 5 more", "Mobile Strategy", "Visual Design Language and UX", "Group Thread", "Learn UX Strategies", "Weekly UX Sync", "UX Group Thread", "Visual Design spec", "Visual Icon Design Library","design process","visual language", "Alison's Keynote"];
  // unknownQuery set to true during the first loop where no known queries are found, reset when newQuery is older than oldQuery
  var unknownQuery = false;
  var remainingKnown = function(newQuery){
    for(var i = 0, x = knownQueries.length; i < x; i++){
      if(knownQueries[i].startsWith(newQuery)){
        return knownQueries[i].substring(newQuery.length);
      }
    }
    unknownQuery = true;
    return '';
  };
  $scope.inputQuery = '';
  $scope.$watch(function(){
    return $scope.inputQuery;
  }, function(newQuery, oldQuery){
    if(newQuery.length < oldQuery.length){
      unknownQuery = false;
    }
    
    if(newQuery.length > 0){
      if(!unknownQuery){
         $scope.suggestedQuery = remainingKnown(newQuery);
        console.log($scope.suggestedQuery);
      }
    } else {
      $scope.suggestedQuery = 'Type something here!';
    }
    
  }, false);
  $scope.editInput = function(){
    $scope.$broadcast('editQuery');
  };
}])
.directive('contenteditable', function(){
  return {
    restrict: 'A',
    link: function(scope, element, attrs){
      
      var read = function(){     
        // TODO: reads the element html, then sets the value to inputQuery
        scope.inputQuery = element.html();
      };
      var clearSuggestion = function(){
        scope.suggestedQuery = scope.suggestedQuery.substring(1);
//         scope.suggestedQuery = '';
      };
     
      element.bind('blur keyup change', function(e){
        if(e.keyCode == 39){
          // if you click the right arrow, fill the rest with the suggested query
          scope.inputQuery += scope.suggestedQuery;
        element.html(scope.inputQuery);
          scope.suggestedQuery = '';
        } else {
          read();
        }
        scope.$apply();
      });
      element.bind('blur', function(){
        scope.$apply(function(){
          scope.isFocused = false;
        });
      });
      element.bind('keydown', function(e){
        
        if(e.keyCode == 13){
          // prevent default enter button
          e.preventDefault();
          return;
        } else if(e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 16 || e.keyCode == 8) {
          // 37 is left arrow, 39 right arrow
          
        } else {
          scope.$apply(clearSuggestion);
        }
      });
      scope.$on('editQuery', function(){
        element[0].focus();
      });
      
    }
  }
});