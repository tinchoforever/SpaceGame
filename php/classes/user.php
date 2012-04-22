<?
class user extends phpillowDocument{
	protected static $type = 'spaceObject';

	protected $requiredProperties = array(
		'name',
		'fbId'
	);

	public function __construct() { 
		$this->properties = array( 
			'name' => new phpillowStringValidator(),
			'fbId' => new phpillowStringValidator(),
			'points' => new phpillowIntegerValidator(),
			'badges' => new phpillowArrayValidator()
		); 
		parent::__construct(); 
	} 

	protected function generateId() { 
		return $this->stringToId( $this->storage->fbId ); 
	} 

	protected function getType() { 
		return self::$type; 
	}
}
?>