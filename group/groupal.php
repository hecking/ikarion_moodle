<?php

require_once('lib.php');

class participant{
    
    function __construct($user, $max_values, $attributes, $weights){
        
        $this->criteria = array();
        $this->id = $user->id;
        
		//Kriterien zuweisen
        foreach($user as $key => $value){ 
            if($key != 'id'){
				if($attributes[$key] == 'heterogen'){
					$heterogen = true;	        
				}else{
					$heterogen = false;
				}
				if($attributes[$key] != 'disabled'){
					$weight = $weights[$key];
					$criterion = new stdClass();
					$criterion->value = $value;
					$criterion->heterogen = $heterogen;
					$criterion->max_value = $max_values->$key;
					$criterion->weight = $weight;
					$this->criteria[$key] = $criterion;    
				}                   
            }
        }
    }    
}


function get_max_values($users, $attributes){
	
	$max_values = new stdClass();
	
	foreach($attributes as $key => $value){
        $max_values->$key = 0;
    }
	
	foreach($users as $user){   
        foreach($user as $key => $value){
            if($key != 'id' and is_numeric($value)){
                if($max_values->$key < $value){
                    $max_values->$key = $value;
                }
            }
        }  
    }
	
	return $max_values;
	
}


function get_distance($c1, $c2){
	
    if(is_null($c1->value) or is_null($c2->value)){
		$distance = 1;
	}elseif(is_numeric($c1->value)){
        $distance = abs(($c1->value - $c2->value) / $c1->max_value);        
    }elseif(!empty($c1->value) and strcasecmp($c1->value,$c2->value) == 0){
        $distance = 0;
    }else{
        $distance = 1;
    }
    
    return $distance;
}

function get_normalized_pair_performance($p1, $p2){
	
	if(count($p1->criteria) == 0){
		return 0;
	}
	
	$homogen = 0;
	$heterogen = 0;
	
	foreach($p1->criteria as $key => $c1){
		
		$c2 = $p2->criteria[$key];
		
		$d = get_distance($c1,$c2);
		$wd = $d * $c1->weight;
		
		if($c1->heterogen){
			$heterogen += $wd;
		}else{
			$homogen += $wd;
		}
	}
	
	$pair_performance_index = $heterogen - $homogen;
		
	$max_dist = 0;
	$hom_max_dist = 0;
		
	foreach($p1->criteria as $key => $c1){
		
		if(!$c1->heterogen){
			$hom_max_dist += $c1->weight;
		}
		$max_dist += $c1->weight;
		
	}
	
	$normalized_pair_performance_index = ($pair_performance_index + $hom_max_dist) / $max_dist;
	
	return $normalized_pair_performance_index;

}


function get_performance_index($performance_indices){
	
	$statistic = new stdClass();
	
	//$statistic->average_varianz = 0;
	$statistic->varianz = 0;
	$statistic->n = 0;
	$statistic->avg = 0;
	$statistic->st_dev = 0;
	$statistic->norm_st_dev = 0;
	$statistic->performance_index = 0;
	
	if(count($performance_indices) < 1){
		return $statistic;
	}
	
	$avg = 0;
	foreach($performance_indices as $performance_index){
		$avg += $performance_index;
	}
	
	$avg = $avg / count($performance_indices);
	$statistic->avg = $avg;
	
	$sum_of_quad_errors = 0;
	foreach($performance_indices as $performance_index){
		$sum_of_quad_errors += pow(($performance_index - $avg),2); 	
	}
	
	//count - 1 in c#
	$varianz = $sum_of_quad_errors / count($performance_indices);
	$statistic->varianz = $varianz;
						
	$st_dev = sqrt($varianz);
	$statistic->st_dev = $st_dev;
	
	$norm_st_dev = 1 / (1 + $st_dev);
	$statistic->norm_st_dev = $norm_st_dev;
	
	if(count($performance_indices) < 2){
		$performance_index = $avg;
	}else{
		$performance_index = $avg * $norm_st_dev;   
	}
	$statistic->performance_index = $performance_index;
	
	$statistic->n = count($performance_indices);
	
	return $statistic;	
	
}


function evaluate_group_performance_index($group){
	
	$npis = array();
	
	for($i = 0; $i < count($group->participants) - 1; $i++){		
		for($j = $i + 1; $j < count($group->participants); $j++){		
			$npi = get_normalized_pair_performance($group->participants[$i], $group->participants[$j]);
			array_push($npis, $npi);
		}
	}
	
	$group->results = get_performance_index($npis);
	$gpi = $group->results->performance_index;
	$group->group_performance_index = $gpi;
	
	return $gpi;
	
}

function evaluate_cohort_performance_index($cohort){
	
	$gpis = array();
	
	foreach($cohort->groups as $group){
		evaluate_group_performance_index($group);
		array_push($gpis, $group->group_performance_index);
	}
	
	$results = get_performance_index($gpis);
	
	$cohort->results = $results;
		
	return $results->performance_index;

}


function match_to_groups($not_yet_matched, $groups){
	
	$gpi = 0;
	$gpi_tmp = 0;
	$delta = 0;
	$delta_old = -INF;
	$best_participant = $not_yet_matched[0];
	
	foreach($groups as $group){
		
		for($i = 0; $i < $group->members_max_size; $i++){
			
			if(count($group->participants) >= $group->members_max_size){
				break;
			}
			
			for($j = 0; $j < count($not_yet_matched); $j++){
				
				$p = $not_yet_matched[$j];
				
				if(count($group->participants) == 0){
					$best_participant = $not_yet_matched[$j];
					break;
				}
				
				evaluate_group_performance_index($group);
				$gpi = $group->group_performance_index;
				
				array_push($group->participants, $p);
				evaluate_group_performance_index($group);
				$gpi_tmp = $group->group_performance_index;
				array_pop($group->participants);				
				
				$delta = $gpi_tmp - $gpi;
				if($gpi == 0){
					$delta = $gpi_tmp;
				}else{
					$delta = $delta / $gpi;
				}
				
				if($delta > $delta_old){
					$best_participant = $not_yet_matched[$j];
					$delta_old = $delta;
				}
				
			}
			
			if(count($not_yet_matched) == 0){
				break;
			}
			
			$delta_old = -INF;
			array_push($group->participants, $best_participant);
			array_remove($not_yet_matched, $best_participant);
		}
		evaluate_group_performance_index($group);	
	}
	
	//Participant Centric Matcher um übriggebliebenen Teilnehmer aufzuteilen
	while(count($not_yet_matched) > 0){
		$p = $not_yet_matched[0];
		foreach($groups as $group){
			if(count($group) >= $group->members_max_size+1){
				continue;
			}
			evaluate_group_performance_index($group);
			$gpi = $group->group_performance_index;
			array_push($group->participants, $p);
			evaluate_group_performance_index($group);
			$gpi_tmp = $group->group_performance_index;
			array_pop($group->participants);
			
			$delta = $gpi_tmp - $gpi;
			if($gpi == 0){
				$delta = $gpi_tmp;
			}else{
				$delta = $delta / $gpi;
			}
			
			if($delta > $delta_old){
				$best_group = $group;
				$delta_old = $delta;
			}
		}
		$delta_old = -INF;
		array_push($best_group->participants, $p);
		array_remove($not_yet_matched, $p);
	}
	evaluate_group_performance_index($group);	
	
	return $groups;
}

function do_one_formation($not_yet_matched, $groups){
	
	$cohort = new stdClass();
	match_to_groups($not_yet_matched, $groups);
	$cohort->groups = $groups;
	evaluate_cohort_performance_index($cohort);	
	return $cohort;
	
}

function optimize_cohort($cohort){
	
	$groups = $cohort->groups;
		
	usort($groups, 'cmp_groups');
	
	for($i = 0; $i < count($groups) / 2; $i++){
		$good_group = $groups[$i];
		$bad_group = $groups[(count($groups) - 1) - $i];
		average_two_groups($good_group, $bad_group);
	}
	evaluate_cohort_performance_index($cohort);
}


function average_two_groups ($good_group, $bad_group){
	
	if(abs($good_group->group_performance_index - $bad_group->group_performance_index) < 0.02){
		return;
	}
	
	$local_ngt = array();
	
	foreach($good_group->participants as $participant){
		array_push($local_ngt, $participant);
	}
	
	foreach($bad_group->participants as $participant){
		array_push($local_ngt, $participant);
	}
	
	shuffle($local_ngt);
	
	$size = $good_group->members_max_size;
	
	$g1 = new stdClass();
	$g1->participants = array();
	$g1->members_max_size = $size;
	$g2 = new stdClass();
	$g2->participants = array();
	$g2->members_max_size = $size;
	
	match_to_groups($local_ngt, array($g1, $g2));
	
	$old_avg = ($good_group->group_performance_index + $bad_group->group_performance_index) / 2;
	$new_avg = ($g1->group_performance_index + $g2->group_performance_index) / 2;
	$first_condition = $new_avg > $old_avg;
	
	$old_std = abs($good_group->group_performance_index - $bad_group->group_performance_index);
	$new_std = abs($g1->group_performance_index - $g2->group_performance_index);
	$second_condition = ($new_std < $old_std) && (abs($new_avg - $old_avg) < 0.01); 
	
	if($first_condition){		
		$good_group->participants = $g1->participants;
		$good_group->group_performance_index = $g1->group_performance_index;
		$bad_group->participants = $g2->participants;
		$bad_group->group_performance_index = $g2->group_performance_index;
	}
	
}

function cmp_groups($g1, $g2){
	
	$result = $g1->group_performance_index - $g2->group_performance_index;
	
	if($result > 0.000000001){
		return 1;
	}elseif($result == 0){
		return 0;
	}else{
		return -1;
	}
}

function array_remove(&$array, $element){
	
	$key = array_search($element ,$array);
	if($key !== false){
		unset($array[$key]);
	}
	
	$_array = array();
	
	foreach($array as $element){
		array_push($_array, $element);
	}
	
	$array = $_array;
	
}

function group_get_pi($group, $attribute){
	
	$tmp = unserialize(serialize($group));
	
	foreach($tmp->participants as $participant){
		foreach($participant->criteria as $key => $value){
			if($key != $attribute){
				array_remove($participant->criteria, $value);
			}
		}
	}
	
	$results = evaluate_group_performance_index($tmp);
	
	return $results;
}


function cohort_get_pi($cohort, $attribute){
	
	$gpis = array();
	
	foreach($cohort->groups as $group){
		array_push($gpis, group_get_pi($group, $attribute));
	}
	
	$results = get_performance_index($gpis);
		
	return $results->performance_index;
		
}